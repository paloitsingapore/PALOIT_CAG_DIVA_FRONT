import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Persona, Scene } from '@soulmachines/smwebsdk';
import { TranscriptEntry } from '@AssistedWayinding/components/molecules/Transcript';
import Help from '@AssistedWayinding/components/organisms/Help';
import styles from '@AssistedWayinding/styles/Help.module.css';

const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY;

interface DigitalPersonaProps {
  personaId: string;
}

const DigitalPersona: React.FC<DigitalPersonaProps> = ({ personaId }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const initializeSceneAndPersona = async () => {
    if (!videoRef.current) return;

    // Disconnect existing scene if it exists
    if (scene) {
      scene.disconnect();
    }

    const sceneOptions = {
      videoElement: videoRef.current,
      audioOnly: false,
      requestedMediaDevices: { microphone: true, camera: true },
      requiredMediaDevices: { microphone: false, camera: false },
      apiKey,
    };

    try {
      const newScene = new Scene(sceneOptions);

      const smwebsdkOnMessage = newScene.onMessage.bind(newScene);

      newScene.onMessage = (message: any) => {
        smwebsdkOnMessage(message);
        // Handle incoming messages and update transcript
        if (message.name === 'personaResponse') {
          if (message.body.currentSpeech) {
            addToTranscript('persona', message.body.currentSpeech);
          }
        } else if (message.name === 'recognizeResults') {
          if (message.body.results && message.body.results[0] && message.body.results[0].final) {
            const transcript = message.body.results[0].alternatives[0].transcript;
            if (transcript) {
              addToTranscript('user', transcript);
            }
          }
        }
      };
      await newScene.connect();

      setScene(newScene);

      // Initialize persona
      const newPersona = new Persona(newScene, personaId);
      setPersona(newPersona);

      console.log('Scene and Persona initialized with personaId:', personaId);

    } catch (error) {
      console.error('Failed to initialize scene:', error);
    }
  };

  const addToTranscript = useCallback((source: 'user' | 'persona', text: string) => {
    const lowerCaseText = text.toLowerCase();
    if (lowerCaseText !== lastMessage?.toLowerCase()) {
      setTranscript(prev => [...prev, {
        source,
        text,
        timestamp: new Date().toISOString()
      }]);
      setLastMessage(lowerCaseText);
    }
  }, [lastMessage]);

  useEffect(() => {
    console.log('personaId changed:', personaId);
    initializeSceneAndPersona();

    return () => {
      if (scene) {
        scene.disconnect();
      }
    };
  }, [personaId]);

  // send initial message to persona
  useEffect(() => {
    if (persona && personaId !== 'unknown') {
      console.log('sending initial message to persona');
      setTranscript([]);
      persona.conversationSend('Hello', {}, {}).then(() => {
        console.log('initial message sent');
      }).catch((error) => {
        console.error('failed to send initial message:', error);
      });
    }
  }, [persona]);

  return (
    <div
      className={styles.backgroundImage}
      style={{
        flexGrow: 1,
        borderRadius: '24px 24px 24px 24px',
        margin: '20px',
      }}
    >

      <Help children={(<video
        id="avatar"
        style={{
          flex: 1,
        }}
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-100 h-100 object-cover"
      />)}
        transcript={

          [
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            // { key: '1', source: "persona", text: "Hello, how can I assist you today?", timestamp: new Date().toISOString() },
            // { key: '2', source: "user", text: "Hello", timestamp: new Date().toISOString() },
            ...transcript
          ]
        } />
    </div>
  );
};

export default DigitalPersona;
