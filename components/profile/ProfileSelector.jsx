'use client';
import ProfileCard from './ProfileCard';
import { Plus } from 'lucide-react';

export default function ProfileSelector({ profiles = [], onSelect, onAddNew, maxProfiles = 5 }) {
  return (
    <div className="min-h-screen bg-cw-bg flex flex-col items-center justify-center p-4">
      <h1 className="text-fluid-2xl md:text-fluid-3xl font-heading font-semibold text-white mb-8">
        Who&apos;s watching?
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {profiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} onClick={() => onSelect(profile)} />
        ))}
        {profiles.length < maxProfiles && (
          <button
            onClick={onAddNew}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-md bg-cw-bg-card border-2 border-cw-text-secondary flex items-center justify-center group-hover:border-white transition-colors">
              <Plus size={40} className="text-cw-text-secondary group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm text-cw-text-secondary group-hover:text-white transition-colors">
              Add Profile
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
