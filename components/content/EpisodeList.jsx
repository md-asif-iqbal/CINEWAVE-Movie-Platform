'use client';
import { useState } from 'react';
import EpisodeCard from './EpisodeCard';

export default function EpisodeList({ seasons = [], contentId }) {
  const [activeSeason, setActiveSeason] = useState(1);

  const currentSeason = seasons.find((s) => s.seasonNumber === activeSeason);
  const episodes = currentSeason?.episodes || [];

  if (!seasons.length) return null;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-fluid-xl font-heading font-semibold text-white">Episodes</h2>
        {seasons.length > 1 && (
          <select
            value={activeSeason}
            onChange={(e) => setActiveSeason(Number(e.target.value))}
            className="bg-cw-bg border-2 border-cw-border rounded-lg px-3 py-2 text-sm text-white min-h-[44px] focus:outline-none focus:border-cw-red"
          >
            {seasons.map((s) => (
              <option key={s.seasonNumber} value={s.seasonNumber}>
                Season {s.seasonNumber}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-3">
        {episodes.map((ep, idx) => (
          <EpisodeCard key={ep._id || idx} episode={ep} number={idx + 1} contentId={contentId} />
        ))}
        {episodes.length === 0 && (
          <p className="text-cw-text-secondary text-sm py-8 text-center">
            No episodes available for this season.
          </p>
        )}
      </div>
    </div>
  );
}
