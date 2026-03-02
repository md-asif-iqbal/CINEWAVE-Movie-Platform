'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useProfile from '@/hooks/useProfile';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Pencil, Trash2, Plus, User } from 'lucide-react';
import Image from 'next/image';

const avatars = [
  '/avatars/default.png',
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const { profiles, loading, createProfile, updateProfile, deleteProfile } = useProfile();
  const { activeProfile, setActiveProfile, clearProfile } = useAuthStore();

  const [editingProfile, setEditingProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [isKids, setIsKids] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Enter a profile name', 'error');
      return;
    }
    setFormLoading(true);
    try {
      await createProfile({ name: name.trim(), avatar: selectedAvatar, isKidsProfile: isKids });
      addToast('Profile created!', 'success');
      resetForm();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to create profile', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Enter a profile name', 'error');
      return;
    }
    setFormLoading(true);
    try {
      await updateProfile(editingProfile._id, {
        name: name.trim(),
        avatar: selectedAvatar,
        isKidsProfile: isKids,
      });
      addToast('Profile updated!', 'success');
      if (activeProfile?._id === editingProfile._id) {
        setActiveProfile({ ...activeProfile, name: name.trim(), avatar: selectedAvatar, isKidsProfile: isKids });
      }
      resetForm();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (profile) => {
    if (!confirm(`Delete profile "${profile.name}"? This cannot be undone.`)) return;
    try {
      await deleteProfile(profile._id);
      addToast('Profile deleted', 'success');
      if (activeProfile?._id === profile._id) {
        clearProfile();
      }
    } catch (err) {
      addToast('Failed to delete profile', 'error');
    }
  };

  const startEdit = (profile) => {
    setEditingProfile(profile);
    setName(profile.name);
    setSelectedAvatar(profile.avatar || avatars[0]);
    setIsKids(profile.isKidsProfile || false);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProfile(null);
    setShowForm(false);
    setName('');
    setSelectedAvatar(avatars[0]);
    setIsKids(false);
  };

  const selectProfile = (profile) => {
    setActiveProfile(profile);
    router.push('/home');
  };

  if (loading) {
    return (
      <div className="pt-20 sm:pt-24 px-4 min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 lg:px-16 pb-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        {showForm ? (editingProfile ? 'Edit Profile' : 'Create Profile') : 'Manage Profiles'}
      </h1>
      <p className="text-cw-text-secondary text-center mb-8">
        {showForm ? 'Set up your profile details' : 'Select a profile to start watching or manage your profiles'}
      </p>

      {showForm ? (
        <form onSubmit={editingProfile ? handleUpdate : handleCreate} className="max-w-md mx-auto space-y-6">
          <Input
            label="Profile Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />

          <div>
            <label className="block text-sm font-medium text-cw-text-muted mb-3">Choose Avatar</label>
            <div className="flex flex-wrap gap-3 justify-center">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedAvatar === av ? 'border-cw-red' : 'border-cw-border hover:border-white'
                  }`}
                >
                  <div className="w-full h-full bg-cw-bg-card flex items-center justify-center">
                    <User size={24} className="text-cw-text-secondary" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-cw-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={isKids}
              onChange={(e) => setIsKids(e.target.checked)}
              className="rounded"
            />
            Kids Profile
          </label>

          <div className="flex gap-3">
            <Button type="submit" loading={formLoading} className="flex-1">
              {editingProfile ? 'Save Changes' : 'Create Profile'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-3xl mx-auto mb-8">
            {profiles.map((p) => (
              <div key={p._id} className="group relative">
                <button
                  onClick={() => selectProfile(p)}
                  className={`w-full flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:bg-cw-bg-card border-2 ${
                    activeProfile?._id === p._id ? 'border-cw-red' : 'border-transparent'
                  }`}
                >
                  <div className="w-20 h-20 rounded-lg bg-cw-bg-secondary flex items-center justify-center overflow-hidden">
                    <User size={32} className="text-cw-text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-center truncate w-full">{p.name}</span>
                  {p.isKidsProfile && (
                    <span className="text-xs text-blue-400">KIDS</span>
                  )}
                </button>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(p)}
                    className="w-7 h-7 bg-cw-bg-secondary rounded-full flex items-center justify-center hover:bg-cw-bg-card"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="w-7 h-7 bg-cw-bg-secondary rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {profiles.length < 5 && (
              <button
                onClick={() => setShowForm(true)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-cw-border hover:border-white transition-colors"
              >
                <div className="w-20 h-20 rounded-lg bg-cw-bg-secondary flex items-center justify-center">
                  <Plus size={32} className="text-cw-text-secondary" />
                </div>
                <span className="text-sm font-medium text-cw-text-muted">Add Profile</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
