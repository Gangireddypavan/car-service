import { Suspense } from 'react';
import MechanicsList from './components/MechanicsList';

export default function MechanicsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading mechanics...</p>
      </div>
    }>
      <MechanicsList />
    </Suspense>
  );
}
