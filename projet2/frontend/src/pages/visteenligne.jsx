import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VirtualVisitPage() {
  const navigate = useNavigate();
  const { appointmentId, patient, docteur, Useremail, Emaildocteur } = useLocation().state || {};

  // Vérifier données essentielles
  if (!appointmentId || !patient || !docteur) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-100 rounded">
        <p className="text-red-700">Données de la visioconférence manquantes.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >Retour</button>
      </div>
    );
  }

  useEffect(() => {
    // Ouvrir directement Google Meet
    window.open('https://meet.google.com/new', '_blank', 'noopener');
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="space-x-4 text-sm">
          <span><strong>Patient:</strong> {patient}</span>
          {Useremail && <span><strong>Votre email:</strong> {Useremail}</span>}
          <span><strong>Docteur:</strong> {docteur}</span>
          {Emaildocteur && <span><strong>Email Docteur:</strong> {Emaildocteur}</span>}
        </div>
        <button
          onClick={() => navigate('/my-appointments')}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >Quitter</button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center bg-white">
        <p className="mb-4 text-lg font-medium">Une nouvelle fenêtre Google Meet s'est ouverte.</p>
        <p className="text-gray-600">Rejoignez la réunion et partagez le lien si nécessaire.</p>
        <button
          onClick={() => window.open('https://meet.google.com/new', '_blank', 'noopener')}
          className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition"
        >Réouvrir Google Meet</button>
      </main>
    </div>
  );
}
