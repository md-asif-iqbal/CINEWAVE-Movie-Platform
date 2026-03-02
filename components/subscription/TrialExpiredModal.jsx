'use client';
import Modal from '@/components/ui/Modal';
import PlansGrid from './PlansGrid';

export default function TrialExpiredModal({ isOpen, onClose, onSelectPlan, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} fullScreenMobile>
      <div className="p-4 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-cw-red font-heading font-extrabold text-xl mb-3">CINEWAVE</h1>
          <h2 className="text-fluid-xl font-heading font-bold text-white mb-2">
            Free Trial Has Ended
          </h2>
          <p className="text-cw-text-muted text-sm">
            Choose a plan to continue using CineWave
          </p>
        </div>
        <PlansGrid onSelectPlan={onSelectPlan} loading={loading} />
      </div>
    </Modal>
  );
}
