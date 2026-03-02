'use client';
import Avatar from '@/components/ui/Avatar';

export default function ProfileCard({ profile, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-3 group">
      <div className="w-20 h-20 md:w-28 md:h-28 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-colors">
        <Avatar
          src={profile.avatar}
          name={profile.name}
          size="xl"
          className="w-full h-full"
        />
      </div>
      <span className="text-sm text-cw-text-secondary group-hover:text-white transition-colors">
        {profile.name}
      </span>
      {profile.isKidsProfile && (
        <span className="text-xs text-blue-400">Kids</span>
      )}
    </button>
  );
}
