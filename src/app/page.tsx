"use client";

import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import FaceRecognition, { FaceRecognitionResponse } from '@AssistedWayinding/components/organisms/FaceDetection';
import { useState } from 'react';

export default function Home() {
  const [personaId, setPersonaId] = useState<string>('unknown');
  const handleFaceRecognized = (data: FaceRecognitionResponse) => {
    console.log('Face recognized:', data);
    setPersonaId(data.passengerData.userId);
  };

  return (
    <div className="flex-grow flex">
      <FaceRecognition onFaceRecognized={handleFaceRecognized} />
      <DigitalPersona personaId={personaId} />
    </div>
  );
}
