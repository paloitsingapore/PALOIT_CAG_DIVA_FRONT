import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Persona, Scene } from '@soulmachines/smwebsdk';
import { TranscriptEntry } from '@AssistedWayinding/components/molecules/Transcript';
import Help from '@AssistedWayinding/components/organisms/Help';
import styles from '@AssistedWayinding/styles/Help.module.css';
import { PassengerData } from '@AssistedWayinding/app/page';

const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY;

interface DigitalPersonaProps {
    personaId: string;
    disableAvatar?: boolean;
    user?: PassengerData;
}

const DigitalPersona: React.FC<DigitalPersonaProps> = ({
    personaId,
    disableAvatar,
    user,
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [scene, setScene] = useState<Scene | null>(null);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [persona, setPersona] = useState<Persona | null>(null);

    const handleMessage = (message: any) => {
        // Handle incoming messages and update transcript
        if (message.name === 'personaResponse') {
            console.log(`Message: ${JSON.stringify(message)}`);
            if (message.body.currentSpeech) {
                addToTranscript('persona', message.body.currentSpeech);
            }
        } else if (message.name === 'recognizeResults') {
            console.log(`Message: ${JSON.stringify(message)}`);
            if (
                message.body.results &&
                message.body.results[0] &&
                message.body.results[0].final
            ) {
                const transcript =
                    message.body.results[0].alternatives[0].transcript;
                if (transcript) {
                    addToTranscript('user', transcript);
                }
            }
        }
    };

    const initializeSceneAndPersona = useCallback(async () => {
        // Disconnect existing scene if it exists
        if (scene) {
            scene.onMessage = () => {};
            scene.disconnect();
        }

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

            newScene.onMessage = handleMessage;
            await newScene.connect();

            setScene(newScene);

            // Initialize persona
            const newPersona = new Persona(newScene, personaId);
            setPersona(newPersona);

            console.log(
                'Scene and Persona initialized with personaId:',
                personaId,
            );
        } catch (error) {
            console.error('Failed to initialize scene:', error);
        }
    }, [personaId, videoRef]);

    const addToTranscript = useCallback(
        (source: 'user' | 'persona', text: string) => {
            setTranscript((prev) => {
                const lowerCaseText = text.toLowerCase();
                const lastEntry = prev[prev.length - 1];

                if (
                    !lastEntry ||
                    lowerCaseText !== lastEntry.text.toLowerCase()
                ) {
                    return [
                        ...prev,
                        {
                            source,
                            text,
                            timestamp: new Date().toISOString(),
                        },
                    ];
                }

                return prev;
            });
        },
        [],
    );

    useEffect(() => {
        console.log('personaId changed:', personaId);
        if (!disableAvatar) {
            initializeSceneAndPersona();
        }

        return () => {
            if (scene) {
                scene.disconnect();
            }
        };
    }, [personaId]);

    // send initial message to persona
    useEffect(() => {
        if (!disableAvatar && persona && personaId !== 'unknown' && user) {
            setTranscript([]);
            persona
                .conversationSend(
                    `Hello, my name is ${user.name}`,
                    {},
                    { age: user.age, gender: user.gender },
                )
                .then(() => {})
                .catch((error) => {
                    console.error('failed to send initial message:', error);
                });
        }
    }, [persona, user]);

    const handleSendMessage = (message: string) => {
        persona?.conversationSend(message, {}, { kind: 'message' });
        setTranscript((prev) => [
            ...prev,
            {
                source: 'user',
                text: message,
                timestamp: new Date().toISOString(),
            },
        ]);
    };

    return (
        <div
            className={styles.backgroundImage}
            style={{
                flexGrow: 1,
                borderRadius: '24px 24px 24px 24px',
                margin: '20px',
            }}
        >
            <Help
                children={
                    disableAvatar ? (
                        <div className={styles.avatar}>Avatar</div>
                    ) : (
                        <video
                            id="avatar"
                            style={{
                                flex: 1,
                            }}
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-100 h-100 object-cover"
                        />
                    )
                }
                transcript={[
                    {
                        key: '1',
                        source: 'persona',
                        text: "Welcome to Changi Airport! I'm your virtual assistant. How may I help you today?",
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '2',
                        source: 'user',
                        text: 'Hi, I have a 5-hour layover. What can I do during this time?',
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '3',
                        source: 'persona',
                        text: 'Great question! Changi Airport offers many activities. You could visit the Butterfly Garden in Terminal 3, enjoy the HSBC Rain Vortex at Jewel, or relax at one of our movie theaters. What interests you most?',
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '4',
                        source: 'user',
                        text: 'The Butterfly Garden sounds interesting. Where is it located?',
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '5',
                        source: 'persona',
                        text: "The Butterfly Garden is located in Terminal 3, near the Transit Area. It's on Level 2 and Level 3. You'll find over 1,000 tropical butterflies amid lush greenery. Would you like directions from your current location?",
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '6',
                        source: 'user',
                        text: "Yes, please. I'm currently at Terminal 2 arrival hall.",
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '7',
                        source: 'persona',
                        text: 'Certainly! From Terminal 2 arrival hall, follow signs to the Skytrain. Take the Skytrain to Terminal 3. Once in Terminal 3, go to Level 2 of the Transit Area. The Butterfly Garden will be clearly signposted. The journey should take about 10-15 minutes.',
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '8',
                        source: 'user',
                        text: 'Thank you! One more question - are there any good places to eat near the Butterfly Garden?',
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '9',
                        source: 'persona',
                        text: "Absolutely! Near the Butterfly Garden, you'll find several dining options. I recommend the Singapore Food Street on Level 3, which offers a variety of local dishes. There's also Poulet, a French casual dining restaurant, on the same level. Both are about a 2-minute walk from the garden.",
                        timestamp: new Date().toISOString(),
                    },
                    {
                        key: '10',
                        source: 'user',
                        text: 'Perfect, thanks for your help!',
                        timestamp: new Date().toISOString(),
                    },
                    ...transcript,
                ]}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default DigitalPersona;
