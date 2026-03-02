'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import axios from 'axios';

export default function SettingsForm({ profile, onUpdate }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: profile?.name || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(`/api/profile/${profile._id}`, data);
      addToast('Profile updated successfully', 'success');
      onUpdate?.();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Input
        label="Profile Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-cw-text-muted mb-1.5">Language</label>
        <select
          {...register('language')}
          defaultValue={profile?.language || 'bn'}
          className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white min-h-[44px] focus:outline-none focus:border-cw-red"
        >
          <option value="bn">Bengali</option>
          <option value="en">English</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-cw-text-muted cursor-pointer">
        <input
          type="checkbox"
          {...register('isKidsProfile')}
          defaultChecked={profile?.isKidsProfile}
          className="rounded"
        />
        Kids Profile
      </label>

      <Button type="submit" loading={loading}>
        Save Changes
      </Button>
    </form>
  );
}
