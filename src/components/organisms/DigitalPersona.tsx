import React, { useEffect, useRef, useState } from 'react';
import { Scene } from '@soulmachines/smwebsdk';
import { TranscriptEntry } from '@AssistedWayinding/components/molecules/Transcript';
import Help from '@AssistedWayinding/components/organisms/Help';
const apiKey =
    'eyJzb3VsSWQiOiJkZG5hLXBhbG9hMjUxLS1jaGFuZ2lhc3Npc3RhbnQiLCJhdXRoU2VydmVyIjoiaHR0cHM6Ly9kaC5zb3VsbWFjaGluZXMuY2xvdWQvYXBpL2p3dCIsImF1dGhUb2tlbiI6ImFwaWtleV92MV82NmFlMTJjYy0xNTNhLTQ2YWEtOWYxOS01ZGMzNDk3YTM4OGEifQ==';
import styles from '@AssistedWayinding/styles/Help.module.css';

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
                        setTranscript((prev) => [
                            ...prev,
                            {
                                source: 'persona',
                                text: message.body.currentSpeech,
                                timestamp: new Date().toISOString(),
                            },
                        ]);
                    } else if (message.name === 'recognizeResults') {
                        setTranscript((prev) => [
                            ...prev,
                            {
                                source: 'user',
                                text: message.body.results[0].alternatives[0]
                                    .transcript,
                                timestamp: new Date().toISOString(),
                            },
                        ]);
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
        <div
            className={styles.backgroundImage}
            style={{
                flexGrow: 1,
                borderRadius: '24px 24px 24px 24px',
                margin: '20px',
            }}
        >
            <video
                id="avatar"
                style={{
                    flex: 1,
                }}
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />
            <Help />
        </div>
    );
};

export default DigitalPersona;
