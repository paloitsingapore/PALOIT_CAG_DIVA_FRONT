"use client";

import { useState, useCallback, useRef } from 'react';
import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import FaceDetection from '@AssistedWayinding/components/organisms/FaceDetection';

interface PassengerData {
  rekognition_collection_id: string;
  userId: string;
  imageUrls: string[];
  name: string;
  gender: string;
  faceIds: string[];
  age: number;
}

interface FaceRecognitionResponse {
  message: string;
  passengerData: PassengerData;
}

export default function Home() {
  const [personaId, setPersonaId] = useState<string>('unknown');
  const [faceDetectionStartTime, setFaceDetectionStartTime] = useState<number | null>(null);
  const [imageSent, setImageSent] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendImageToAPI = useCallback(async (base64Image: string) => {
    if (!imageSent) {
      console.log('Sending image to API');
      
      try {
        setImageSent(true);
        const response = await fetch('https://ijiv62tdzd.execute-api.ap-southeast-2.amazonaws.com/prod/recognize', {
          method: 'POST',
          body: JSON.stringify({ image: base64Image }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data: FaceRecognitionResponse = await response.json();
        
        setPersonaId(data.passengerData.userId);
      } catch (error) {
        console.error('Error sending image to API:', error);
      }
    }
  }, [imageSent]);

  const handleFaceDetected = useCallback((base64Image: string) => {
    if (faceDetectionStartTime === null) {
      setFaceDetectionStartTime(Date.now());
    } else if (!imageSent) {
      const elapsedTime = Date.now() - faceDetectionStartTime;
      if (elapsedTime >= 3000) {
        if (timeoutRef.current === null) {
          timeoutRef.current = setTimeout(() => {
            sendImageToAPI(base64Image);
            timeoutRef.current = null;
          }, 0);
        }
      }
    }
  }, [faceDetectionStartTime, sendImageToAPI, imageSent]);

  return (
    <div className="flex-grow flex">
      <FaceDetection onFaceDetected={handleFaceDetected} />
      <DigitalPersona personaId={personaId} />
    </div>
  );
}
