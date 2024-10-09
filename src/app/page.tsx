"use client";

import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import WebcamDemo from '@AssistedWayinding/components/organisms/FaceDetection';

export default function Home() {
  return (
    <div className="flex-grow flex">
      {/* <WebcamDemo /> */}
      <DigitalPersona />
    </div>
  );
}
