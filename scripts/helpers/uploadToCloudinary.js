/**
 * Download image from URL and upload to Cloudinary.
 * Uses the EXISTING Cloudinary config from env vars.
 * Skips re-upload if asset already exists on Cloudinary.
 */

const { v2: cloudinary } = require('cloudinary');
const https = require('https');
const http = require('http');

// Ensure Cloudinary is configured (uses same env vars as lib/cloudinary.js)
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Download an image from sourceUrl and upload it to Cloudinary.
 * Returns the Cloudinary secure_url, or null/fallback on failure.
 */
async function downloadAndUpload(sourceUrl, folder, publicId) {
  if (!sourceUrl || sourceUrl.includes('placeholder')) return null;

  const fullPublicId = `cinewave/${folder}/${publicId}`;

  try {
    // Check if already uploaded to Cloudinary (avoid re-upload on re-run)
    try {
      const existing = await cloudinary.api.resource(fullPublicId, { resource_type: 'image' });
      if (existing && existing.secure_url) {
        console.log(`  ↩ Already on Cloudinary: ${folder}/${publicId}`);
        return existing.secure_url;
      }
    } catch (_e) {
      // Not found on Cloudinary — proceed with download + upload
    }

    // Download image as buffer
    const buffer = await downloadAsBuffer(sourceUrl);
    if (!buffer || buffer.length === 0) return null;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `cinewave/${folder}`,
          public_id: publicId,
          overwrite: false,
          resource_type: 'image',
          transformation:
            folder === 'backdrops'
              ? [{ width: 1280, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
              : [{ width: 500, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    console.log(`  ✅ Uploaded: ${folder}/${publicId}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ❌ Upload failed for ${publicId}: ${err.message}`);
    return sourceUrl; // fallback to original URL if upload fails
  }
}

/**
 * Download a URL into a Buffer, following redirects.
 */
function downloadAsBuffer(url) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(null);
    const protocol = url.startsWith('https') ? https : http;

    protocol
      .get(url, { timeout: 15000 }, (res) => {
        // Follow redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (!redirectUrl) return resolve(null);
          return downloadAsBuffer(redirectUrl).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          return resolve(null);
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject)
      .on('timeout', function () {
        this.destroy();
        resolve(null);
      });
  });
}

module.exports = { downloadAndUpload };
