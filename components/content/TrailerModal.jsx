'use client';
import Modal from '@/components/ui/Modal';

export default function TrailerModal({ isOpen, onClose, trailerUrl, title }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="aspect-video bg-black">
        {trailerUrl ? (
          <video
            src={trailerUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cw-text-secondary">
            Trailer not available
          </div>
        )}
      </div>
    </Modal>
  );
}
