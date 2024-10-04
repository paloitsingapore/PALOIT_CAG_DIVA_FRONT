import React, { useEffect, useRef, useState } from 'react';
import { Scene } from '@soulmachines/smwebsdk';
import Transcript, { TranscriptEntry } from '@AssistedWayinding/components/molecules/Transcript';

const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY;

const DigitalPersona: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  useEffect(() => {
    const initializeScene = async () => {
      if (!videoRef.current) return;

      const sceneOptions = {
        videoElement: videoRef.current,
        audioOnly: false,
        requestedMediaDevices: { microphone: true, camera: true },
        requiredMediaDevices: { microphone: false, camera: false },
        apiKey,
      };

      try {
        const newScene = new Scene(sceneOptions);
        await newScene.connect();
        setScene(newScene);

        const smwebsdkOnMessage = newScene.onMessage.bind(scene);

        newScene.onMessage = (message: any) => {
          smwebsdkOnMessage(message);
          // Handle incoming messages and update transcript
          if (message.name === 'personaResponse') {
            setTranscript(prev => [...prev, {
              source: 'persona',
              text: message.body.currentSpeech,
              timestamp: new Date().toISOString()
            }]);
          } else if (message.name === 'recognizeResults') {
            setTranscript(prev => [...prev, {
              source: 'user',
              text: message.body.results[0].alternatives[0].transcript,
              timestamp: new Date().toISOString()
            }]);
          }
        };

      } catch (error) {
        console.error('Failed to initialize scene:', error);
      }
    };

    initializeScene();

    return () => {
      if (scene) {
        scene.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex-grow relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <Transcript transcript={transcript} />
    </div>
  );
};

export default DigitalPersona;


