'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Film, ChevronDown, ChevronUp, Youtube, Link as LinkIcon, Edit3 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';

/**
 * Helper: extract YouTube video ID from various URL formats
 */
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:embed\/|watch\?v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

/**
 * EpisodeManager — Full episode CRUD for a series content item.
 * Shows existing episodes grouped by season, with inline editing and
 * the ability to add new episodes with YouTube URLs.
 */
export default function EpisodeManager({ contentId, contentTitle }) {
  const { addToast } = useToast();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // New episode form
  const [newEp, setNewEp] = useState({
    season: 1,
    episode: 1,
    title: '',
    description: '',
    duration: 45,
    videoUrl: '',
    thumbnailUrl: '',
  });

  useEffect(() => {
    fetchEpisodes();
  }, [contentId]);

  const fetchEpisodes = async () => {
    try {
      const { data } = await axios.get(`/api/admin/content/${contentId}/episodes`);
      setEpisodes(data.episodes || []);
      // Auto-expand first season with episodes
      if (data.episodes?.length > 0) {
        const seasons = [...new Set(data.episodes.map((e) => e.season))];
        setExpandedSeason(Math.min(...seasons));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group episodes by season
  const seasons = {};
  episodes.forEach((ep) => {
    if (!seasons[ep.season]) seasons[ep.season] = [];
    seasons[ep.season].push(ep);
  });
  Object.values(seasons).forEach((eps) => eps.sort((a, b) => a.episode - b.episode));
  const seasonNumbers = Object.keys(seasons).map(Number).sort((a, b) => a - b);

  // Auto-fill YouTube thumbnail when pasting a YouTube URL
  const handleVideoUrlChange = (url, setter, currentData) => {
    const ytId = getYouTubeId(url);
    const updates = { videoUrl: url };
    // Auto-set thumbnail from YouTube if thumbnail is empty
    if (ytId && !currentData.thumbnailUrl) {
      updates.thumbnailUrl = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    }
    // Auto-convert youtu.be / watch URLs to embed format
    if (ytId && !url.includes('/embed/')) {
      updates.videoUrl = `https://www.youtube.com/embed/${ytId}`;
    }
    setter((prev) => ({ ...prev, ...updates }));
  };

  // ─── Add Episode ─────────────────────────────────────────
  const handleAdd = async () => {
    if (!newEp.title || !newEp.videoUrl) {
      addToast('Title and Video URL are required', 'error');
      return;
    }
    setSaving(true);
    try {
      // Ensure embed format
      const ytId = getYouTubeId(newEp.videoUrl);
      const videoUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : newEp.videoUrl;
      const thumbnailUrl = newEp.thumbnailUrl || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

      const { data } = await axios.post(`/api/admin/content/${contentId}/episodes`, {
        ...newEp,
        videoUrl,
        thumbnailUrl,
      });
      setEpisodes((prev) => [...prev, data.episode]);
      setExpandedSeason(newEp.season);
      setShowAddForm(false);
      // Auto-increment episode number
      setNewEp({
        season: newEp.season,
        episode: newEp.episode + 1,
        title: '',
        description: '',
        duration: 45,
        videoUrl: '',
        thumbnailUrl: '',
      });
      addToast(`Episode S${String(newEp.season).padStart(2, '0')}E${String(newEp.episode).padStart(2, '0')} added!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to add episode', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit Episode ────────────────────────────────────────
  const startEdit = (ep) => {
    setEditingId(ep._id);
    setEditData({
      title: ep.title,
      description: ep.description || '',
      duration: ep.duration || 45,
      videoUrl: ep.videoUrl || '',
      thumbnailUrl: ep.thumbnailUrl || '',
    });
  };

  const saveEdit = async (epId) => {
    setSaving(true);
    try {
      const ytId = getYouTubeId(editData.videoUrl);
      const videoUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : editData.videoUrl;
      const thumbnailUrl = editData.thumbnailUrl || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

      await axios.put(`/api/admin/content/${contentId}/episodes/${epId}`, {
        ...editData,
        videoUrl,
        thumbnailUrl,
      });
      setEpisodes((prev) =>
        prev.map((e) => (e._id === epId ? { ...e, ...editData, videoUrl, thumbnailUrl } : e))
      );
      setEditingId(null);
      addToast('Episode updated!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete Episode ──────────────────────────────────────
  const handleDelete = async (epId, label) => {
    if (!confirm(`Delete ${label}?`)) return;
    try {
      await axios.delete(`/api/admin/content/${contentId}/episodes/${epId}`);
      setEpisodes((prev) => prev.filter((e) => e._id !== epId));
      addToast('Episode deleted', 'success');
    } catch (err) {
      addToast('Failed to delete episode', 'error');
    }
  };

  if (loading) {
    return <div className="text-cw-text-muted py-8 text-center">Loading episodes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">
          Episodes {episodes.length > 0 && <span className="text-cw-text-muted font-normal text-sm">({episodes.length} total)</span>}
        </h3>
        <Button type="button" size="sm" onClick={() => setShowAddForm(!showAddForm)} className="gap-1.5">
          <Plus size={16} />
          Add Episode
        </Button>
      </div>

      {/* ─── Add Episode Form ───────────────────────────────── */}
      {showAddForm && (
        <div className="bg-cw-bg-card border border-cw-border rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-medium text-cw-text-muted flex items-center gap-2">
            <Film size={16} /> New Episode
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Season"
              type="number"
              min={1}
              value={newEp.season}
              onChange={(e) => setNewEp({ ...newEp, season: parseInt(e.target.value) || 1 })}
            />
            <Input
              label="Episode"
              type="number"
              min={1}
              value={newEp.episode}
              onChange={(e) => setNewEp({ ...newEp, episode: parseInt(e.target.value) || 1 })}
            />
            <Input
              label="Duration (min)"
              type="number"
              value={newEp.duration}
              onChange={(e) => setNewEp({ ...newEp, duration: parseInt(e.target.value) || 45 })}
            />
          </div>
          <Input
            label="Title *"
            value={newEp.title}
            onChange={(e) => setNewEp({ ...newEp, title: e.target.value })}
            placeholder="Episode title"
          />
          <div>
            <label className="block text-sm font-medium text-cw-text-muted mb-1.5">Description</label>
            <textarea
              value={newEp.description}
              onChange={(e) => setNewEp({ ...newEp, description: e.target.value })}
              rows={2}
              className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cw-red resize-none"
              placeholder="Episode description"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cw-text-muted mb-1.5 flex items-center gap-1.5">
              <Youtube size={14} className="text-red-500" /> Video URL *
            </label>
            <input
              value={newEp.videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value, setNewEp, newEp)}
              placeholder="Paste YouTube URL: https://youtu.be/xxxxx or https://youtube.com/watch?v=xxxxx"
              className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cw-red placeholder:text-cw-text-secondary"
            />
            <p className="mt-1 text-xs text-cw-text-secondary">
              Supports: youtu.be/ID, youtube.com/watch?v=ID, or any direct video URL
            </p>
          </div>
          <Input
            label="Thumbnail URL"
            value={newEp.thumbnailUrl}
            onChange={(e) => setNewEp({ ...newEp, thumbnailUrl: e.target.value })}
            placeholder="Auto-filled from YouTube, or paste custom URL"
          />
          {/* YouTube thumbnail preview */}
          {newEp.thumbnailUrl && (
            <div className="w-32 h-20 rounded overflow-hidden bg-black">
              <img src={newEp.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleAdd} loading={saving} className="gap-1.5">
              <Save size={14} /> Save Episode
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ─── Episodes List by Season ────────────────────────── */}
      {seasonNumbers.length === 0 && !showAddForm && (
        <div className="text-center py-8 bg-cw-bg-card rounded-xl border border-cw-border">
          <Film size={32} className="mx-auto text-cw-text-secondary mb-2" />
          <p className="text-cw-text-muted">No episodes yet</p>
          <p className="text-xs text-cw-text-secondary mt-1">Click "Add Episode" to add episodes with YouTube URLs</p>
        </div>
      )}

      {seasonNumbers.map((sNum) => (
        <div key={sNum} className="bg-cw-bg-card border border-cw-border rounded-xl overflow-hidden">
          {/* Season Header */}
          <button
            type="button"
            onClick={() => setExpandedSeason(expandedSeason === sNum ? null : sNum)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-cw-bg transition-colors"
          >
            <span className="font-medium text-white">
              Season {sNum} <span className="text-cw-text-muted text-sm font-normal">({seasons[sNum].length} episodes)</span>
            </span>
            {expandedSeason === sNum ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Episode List */}
          {expandedSeason === sNum && (
            <div className="border-t border-cw-border divide-y divide-cw-border/50">
              {seasons[sNum].map((ep) => (
                <div key={ep._id} className="px-4 py-3">
                  {editingId === ep._id ? (
                    /* ── Inline Edit Mode ── */
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Title"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        />
                        <Input
                          label="Duration"
                          type="number"
                          value={editData.duration}
                          onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) || 45 })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-cw-text-muted mb-1 flex items-center gap-1">
                          <Youtube size={12} className="text-red-500" /> Video URL
                        </label>
                        <input
                          value={editData.videoUrl}
                          onChange={(e) => handleVideoUrlChange(e.target.value, setEditData, editData)}
                          placeholder="YouTube URL or direct video URL"
                          className="w-full bg-cw-bg border border-cw-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cw-red"
                        />
                      </div>
                      <Input
                        label="Thumbnail URL"
                        value={editData.thumbnailUrl}
                        onChange={(e) => setEditData({ ...editData, thumbnailUrl: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={() => saveEdit(ep._id)} loading={saving} className="gap-1">
                          <Save size={12} /> Save
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ── Display Mode ── */
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-24 h-14 rounded bg-cw-bg-secondary flex-shrink-0 overflow-hidden">
                        {ep.thumbnailUrl ? (
                          <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cw-text-secondary">
                            <Film size={18} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cw-red">
                            S{String(ep.season).padStart(2, '0')}E{String(ep.episode).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-medium text-white truncate">{ep.title}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {ep.duration && (
                            <span className="text-xs text-cw-text-muted">{ep.duration} min</span>
                          )}
                          {ep.videoUrl && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              {getYouTubeId(ep.videoUrl) ? (
                                <><Youtube size={10} /> YouTube</>
                              ) : (
                                <><LinkIcon size={10} /> Direct</>
                              )}
                            </span>
                          )}
                          {!ep.videoUrl && (
                            <span className="text-xs text-yellow-400">No video URL</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(ep)}
                          className="p-2 text-cw-text-muted hover:text-white transition-colors rounded-lg hover:bg-cw-bg"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ep._id, `S${ep.season}E${ep.episode}`)}
                          className="p-2 text-cw-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-cw-bg"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
