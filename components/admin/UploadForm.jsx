'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, ImageIcon, Film, Loader2, CheckCircle, Youtube } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';
import EpisodeManager from './EpisodeManager';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const genres = ['Action', 'Adventure', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Family'];
const types = ['movie', 'series', 'documentary', 'short'];
const statuses = ['active', 'inactive', 'coming_soon'];
const languages = ['Bengali', 'English', 'Hindi', 'Korean', 'Japanese', 'Spanish', 'French'];

export default function UploadForm({ initialData, onSuccess }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(initialData?.genre || []);
  const [selectedLanguages, setSelectedLanguages] = useState(initialData?.language || []);
  const [cast, setCast] = useState(initialData?.cast || []);
  // { fieldName: { progress: 0-100, done: bool } }
  const [uploadStates, setUploadStates] = useState({});

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'movie',
      description: initialData?.description || '',
      longDescription: initialData?.longDescription || '',
      year: initialData?.year || new Date().getFullYear(),
      duration: initialData?.duration || '',
      maturityRating: initialData?.maturityRating || 'ALL',
      director: initialData?.director || '',
      producer: initialData?.producer || '',
      studio: initialData?.studio || '',
      thumbnailUrl: initialData?.thumbnailUrl || '',
      backdropUrl: initialData?.backdropUrl || '',
      trailerUrl: initialData?.trailerUrl || '',
      videoUrl: initialData?.videoUrl || '',
      status: initialData?.status || 'active',
      featured: initialData?.featured || false,
      trending: initialData?.trending || false,
      newRelease: initialData?.newRelease || false,
      imdbRating: initialData?.rating?.imdb || '',
      tags: initialData?.tags?.join(', ') || '',
    },
  });

  const toggleGenre = (g) => {
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  };

  const toggleLanguage = (l) => {
    setSelectedLanguages((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  };

  const setFieldUpload = (fieldName, state) =>
    setUploadStates((prev) => ({ ...prev, [fieldName]: state }));

  // Images go through the admin-protected server API
  const uploadImage = async (file, fieldName) => {
    setFieldUpload(fieldName, { progress: 0, done: false });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    try {
      const { data } = await axios.post('/api/upload', formData, {
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded / e.total) * 100);
          setFieldUpload(fieldName, { progress: pct, done: false });
        },
      });
      setValue(fieldName, data.url);
      setFieldUpload(fieldName, { progress: 100, done: true });
      addToast('Image uploaded!', 'success');
    } catch (err) {
      setFieldUpload(fieldName, null);
      addToast(err.response?.data?.error || 'Image upload failed', 'error');
    }
  };

  // Videos go DIRECTLY to Cloudinary from the browser (no server memory limit)
  const uploadVideo = (file, fieldName) => {
    setFieldUpload(fieldName, { progress: 0, done: false });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', 'video');
    formData.append('folder', 'cinewave/videos');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setFieldUpload(fieldName, { progress: pct, done: false });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setValue(fieldName, res.secure_url);
        setFieldUpload(fieldName, { progress: 100, done: true });
        addToast('Video uploaded to Cloudinary!', 'success');
      } else {
        setFieldUpload(fieldName, null);
        addToast('Video upload failed', 'error');
      }
    };

    xhr.onerror = () => {
      setFieldUpload(fieldName, null);
      addToast('Video upload error', 'error');
    };

    xhr.send(formData);
  };

  const handleFileChange = (e, fieldName, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'video') uploadVideo(file, fieldName);
    else uploadImage(file, fieldName);
  };

  const addCastMember = () => {
    setCast([...cast, { name: '', character: '', photo: '' }]);
  };

  const removeCastMember = (idx) => {
    setCast(cast.filter((_, i) => i !== idx));
  };

  const updateCast = (idx, field, value) => {
    const updated = [...cast];
    updated[idx][field] = value;
    setCast(updated);
  };

  const onSubmit = async (data) => {
    if (selectedGenres.length === 0) {
      addToast('Select at least one genre', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...data,
        genre: selectedGenres,
        language: selectedLanguages,
        cast,
        year: parseInt(data.year),
        duration: data.duration ? parseInt(data.duration) : undefined,
        rating: { imdb: data.imdbRating ? parseFloat(data.imdbRating) : 0 },
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (initialData?._id) {
        await axios.put(`/api/admin/content/${initialData._id}`, payload);
        addToast('Content updated!', 'success');
      } else {
        await axios.post('/api/admin/content', payload);
        addToast('Content created!', 'success');
      }
      onSuccess?.();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to save', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Title *" {...register('title', { required: 'Title required' })} error={errors.title?.message} />
        <div>
          <label className="block text-sm font-medium text-cw-text-muted mb-1.5">Type *</label>
          <select {...register('type')} className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white min-h-[44px] focus:outline-none focus:border-cw-red">
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cw-text-muted mb-1.5">Description *</label>
        <textarea {...register('description', { required: 'Description required' })} rows={3} className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white placeholder:text-cw-text-secondary focus:outline-none focus:ring-2 focus:ring-cw-red/50 focus:border-cw-red resize-none" />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-cw-text-muted mb-1.5">Long Description</label>
        <textarea {...register('longDescription')} rows={4} className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white placeholder:text-cw-text-secondary focus:outline-none focus:ring-2 focus:ring-cw-red/50 focus:border-cw-red resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-cw-text-muted mb-2">Genres *</label>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-[36px] ${selectedGenres.includes(g) ? 'bg-cw-red text-white' : 'bg-cw-bg-card text-cw-text-muted hover:text-white'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cw-text-muted mb-2">Languages</label>
        <div className="flex flex-wrap gap-2">
          {languages.map((l) => (
            <button key={l} type="button" onClick={() => toggleLanguage(l)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-[36px] ${selectedLanguages.includes(l) ? 'bg-cw-red text-white' : 'bg-cw-bg-card text-cw-text-muted hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Input label="Year" type="number" {...register('year')} />
        <Input label="Duration (min)" type="number" {...register('duration')} />
        <Input label="IMDB Rating" type="number" step="0.1" {...register('imdbRating')} />
        <Input label="Maturity Rating" {...register('maturityRating')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Director" {...register('director')} />
        <Input label="Producer" {...register('producer')} />
        <Input label="Studio" {...register('studio')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thumbnail */}
        <UploadField
          label="Thumbnail Image"
          fieldName="thumbnailUrl"
          accept="image/*"
          type="image"
          icon={<ImageIcon size={18} />}
          register={register}
          watch={watch}
          uploadState={uploadStates['thumbnailUrl']}
          onFileChange={handleFileChange}
          anyUploading={Object.values(uploadStates).some((s) => s && !s.done)}
        />

        {/* Backdrop */}
        <UploadField
          label="Backdrop Image"
          fieldName="backdropUrl"
          accept="image/*"
          type="image"
          icon={<ImageIcon size={18} />}
          register={register}
          watch={watch}
          uploadState={uploadStates['backdropUrl']}
          onFileChange={handleFileChange}
          anyUploading={Object.values(uploadStates).some((s) => s && !s.done)}
        />

        {/* Trailer */}
        <UploadField
          label="Trailer Video"
          fieldName="trailerUrl"
          accept="video/*"
          type="video"
          icon={<Film size={18} />}
          register={register}
          watch={watch}
          uploadState={uploadStates['trailerUrl']}
          onFileChange={handleFileChange}
          anyUploading={Object.values(uploadStates).some((s) => s && !s.done)}
          isVideo
        />

        {/* Main Video */}
        <UploadField
          label="Main Video File"
          fieldName="videoUrl"
          accept="video/*"
          type="video"
          icon={<Film size={18} />}
          register={register}
          watch={watch}
          uploadState={uploadStates['videoUrl']}
          onFileChange={handleFileChange}
          anyUploading={Object.values(uploadStates).some((s) => s && !s.done)}
          isVideo
        />
      </div>

      {/* YouTube Tip */}
      <div className="bg-cw-bg-card border border-cw-border rounded-lg p-3 flex items-start gap-3">
        <Youtube size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-cw-text-secondary">
          <p className="font-medium text-cw-text-muted mb-1">YouTube Video Support</p>
          <p>You can paste YouTube URLs directly into Trailer/Video fields — no upload needed.</p>
          <p className="mt-1">Supported formats: <code className="text-cw-text-muted">youtu.be/ID</code>, <code className="text-cw-text-muted">youtube.com/watch?v=ID</code>, <code className="text-cw-text-muted">youtube.com/embed/ID</code></p>
          <p className="mt-1 text-yellow-400/80">Videos must be "Unlisted" (not Private) to play in the embedded player.</p>
        </div>
      </div>

      <Input label="Tags (comma separated)" {...register('tags')} placeholder="action, thriller, new" />

      <div>
        <label className="block text-sm font-medium text-cw-text-muted mb-1.5">Status</label>
        <select {...register('status')} className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white min-h-[44px] focus:outline-none focus:border-cw-red">
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-cw-text-muted cursor-pointer">
          <input type="checkbox" {...register('featured')} className="rounded" /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-cw-text-muted cursor-pointer">
          <input type="checkbox" {...register('trending')} className="rounded" /> Trending
        </label>
        <label className="flex items-center gap-2 text-sm text-cw-text-muted cursor-pointer">
          <input type="checkbox" {...register('newRelease')} className="rounded" /> New Release
        </label>
      </div>

      {/* Cast */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-cw-text-muted">Cast</label>
          <Button type="button" variant="ghost" size="sm" onClick={addCastMember} className="gap-1">
            <Plus size={14} /> Add
          </Button>
        </div>
        {cast.map((member, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input value={member.name} onChange={(e) => updateCast(idx, 'name', e.target.value)} placeholder="Name" className="flex-1 bg-cw-bg border-2 border-cw-border rounded-lg px-3 py-2 text-white text-sm min-h-[40px] focus:outline-none focus:border-cw-red" />
            <input value={member.character} onChange={(e) => updateCast(idx, 'character', e.target.value)} placeholder="Character" className="flex-1 bg-cw-bg border-2 border-cw-border rounded-lg px-3 py-2 text-white text-sm min-h-[40px] focus:outline-none focus:border-cw-red" />
            <button type="button" onClick={() => removeCastMember(idx)} className="min-w-[36px] min-h-[36px] flex items-center justify-center text-red-400">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
        {initialData ? 'Update Content' : 'Create Content'}
      </Button>

      {/* Episode Manager — Show for series/documentary after content is saved */}
      {initialData?._id && (initialData?.type === 'series' || watch('type') === 'series') && (
        <div className="mt-8 pt-8 border-t border-cw-border">
          <EpisodeManager contentId={initialData._id} contentTitle={initialData.title} />
        </div>
      )}
    </form>
  );
}
// ---- Sub-component for a single upload field ----
function UploadField({ label, fieldName, accept, type, icon, register, watch, uploadState, onFileChange, anyUploading, isVideo }) {
  const url = watch(fieldName);
  const uploading = uploadState && !uploadState.done;
  const done = uploadState?.done;
  const progress = uploadState?.progress ?? 0;

  return (
    <div>
      <label className="block text-sm font-medium text-cw-text-muted mb-1.5">
        {label}
        {isVideo && <span className="ml-2 text-xs text-cw-text-secondary">(direct Cloudinary upload)</span>}
      </label>

      <div className="flex gap-2">
        <input
          {...register(fieldName)}
          placeholder="https://... or click upload button →"
          disabled={uploading}
          className="flex-1 bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white text-sm min-h-[44px] focus:outline-none focus:border-cw-red placeholder:text-cw-text-secondary disabled:opacity-50"
        />
        <label
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center border-2 rounded-lg transition-colors ${
            uploading || anyUploading
              ? 'border-cw-border opacity-50 cursor-not-allowed'
              : done
              ? 'border-green-500 cursor-pointer'
              : 'border-cw-border cursor-pointer hover:border-white'
          }`}
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin text-cw-red" />
          ) : done ? (
            <CheckCircle size={18} className="text-green-500" />
          ) : (
            <span className="text-cw-text-muted">{icon}</span>
          )}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading || anyUploading}
            onChange={(e) => onFileChange(e, fieldName, type)}
          />
        </label>
      </div>

      {/* Progress bar (visible when uploading) */}
      {uploading && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-cw-text-muted mb-1">
            <span>Uploading{isVideo ? ' to Cloudinary' : ''}...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-cw-bg-secondary rounded-full h-1.5">
            <div
              className="h-full bg-cw-red rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* URL preview */}
      {!uploading && url && (
        <p className="mt-1 text-xs text-green-400 truncate">{url}</p>
      )}
    </div>
  );
}