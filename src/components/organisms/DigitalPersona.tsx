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
  onEndConversation?: () => void;
}

const DigitalPersona: React.FC<DigitalPersonaProps> = ({
  personaId,
  disableAvatar,
  user,
  onEndConversation,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [persona, setPersona] = useState<Persona | null>(null);
  const transcriptLengthRef = useRef(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener(
          'loadeddata',
          handleVideoLoaded,
        );
      }
    };
  }, []);

  const initializeSceneAndPersona = useCallback(async () => {
    // Disconnect existing scene if it exists
    if (scene) {
      scene.onMessage = () => { };
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
      const smwebsdkOnMessage = newScene.onMessage.bind(newScene);

      newScene.onMessage = (message: any) => {
        smwebsdkOnMessage(message);
        const attributes: { [key: string]: any } = {};
        // Handle incoming messages and update transcript
        if (message.name === 'personaResponse') {
          console.log(`Message: ${JSON.stringify(message)}`);
          if (message.body.currentSpeech) {
            // Check for "Qantas bag drop" using a flexible regex
            const qantasBagDropRegex =
              /\b(?=.*qantas)(?=.*bag)(?=.*drop).*\b/i;
            if (
              qantasBagDropRegex.test(message.body.currentSpeech)
            ) {
              attributes['image'] = [
                'https://i.imgur.com/TecKia9.png',
              ];
            }

            // if wheelchair, add image
            const wheelchairRegex = /\b(?=.*wheelchair).*\b/i;
            if (wheelchairRegex.test(message.body.currentSpeech)) {
              attributes['image'] = [
                'https://i.imgur.com/e5afI8w.png',
              ];
            }

            // if "level 1", add image
            const level1Regex = /\b(?=.*level)(?=.*1).*\b/i;
            if (level1Regex.test(message.body.currentSpeech)) {
              attributes['image'] = [
                'https://i.imgur.com/hbXx2ge.png',
              ];
            }

            // if transcript is empty, add options
            const options = [];
            if (transcriptLengthRef.current === 0 && !user) {
              options.push(
                {
                  name: 'Airport Lounges',
                },
                {
                  name: 'Accessibility Services',
                },
                {
                  name: 'Duty-Free Shopping',
                },
                {
                  name: 'Changi Airport Attractions',
                },
              );
            } else if (transcriptLengthRef.current === 0 && user) {
              if (
                user.accessibilityPreferences
                  .wheelchairAccessibility
              ) {
                options.push({
                  name: 'Wheelchair Assistance',
                });
              }
              if (user.has_lounge_access) {
                options.push({
                  name: `Lounge ${user.lounge_name}`,
                  action: `How to get to lounge ${user.lounge_name}`,
                });
              }
              if (user.gate) {
                options.push({
                  name: `Gate ${user.gate}`,
                  acction: `How to get to gate ${user.gate}`,
                });
              }
            }
            addToTranscript(
              'persona',
              message.body.currentSpeech,
              attributes,
              options,
              message,
            );
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
              addToTranscript('user', transcript, message);
            }
          }
        }
      };
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

  const handleEndConversation = () => {
    setTranscript([]); // Clear the transcript
    initializeSceneAndPersona(); // Reload the scene and persona
    onEndConversation?.();
  };

  const addToTranscript = useCallback(
    (
      source: 'user' | 'persona',
      text: string,
      attributes?: any,
      options?: {
        name: string;
        action?: string;
      }[],
      message?: any,
    ) => {
      setTranscript((prev) => {
        const lowerCaseText = text.toLowerCase();
        const lastEntry = prev[prev.length - 1];

        if (
          !lastEntry ||
          lowerCaseText !== lastEntry.text.toLowerCase()
        ) {
          const newTranscript = [
            ...prev,
            {
              source,
              text,
              timestamp: new Date().toISOString(),
              attributes,
              options,
              message,
            },
          ];
          // Update transcriptLengthRef
          transcriptLengthRef.current = newTranscript.length;
          return newTranscript;
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
      transcriptLengthRef.current = 0;
      persona
        .conversationSend(
          `Hello, my name is ${user.name}. Please don't give me any options unless I ask for them. These are my flight details: ${JSON.stringify(user)}. `,
          {
            dateOfBirth: user.dateOfBirth,
            hasLoungeAccess: user.has_lounge_access,
            nextFlightId: user.next_flight_id,
            passengerId: user.passengerId,
            rekognitionCollectionId: user.rekognition_collection_id,
            userId: user.userId,
            changiAppUserId: user.changi_app_user_id,
            language: user.language,
            gate: user.gate,
            loungeName: user.lounge_name,
            airline: user.airline,
          },
          {},
        )
        .then(() => { })
        .catch((error) => {
          console.error('failed to send initial message:', error);
        });
    }
  }, [persona, user]);

  const handleSendMessage = (message: string) => {
    console.log('send message message:', message);
    // find every 'user' transcript entry
    const userTranscript = transcript.find(
      (entry) => entry.source === 'user',
    );
    if (!userTranscript) {
      message = 'Hello, ' + message;
    }
    persona!
      .conversationSend(message, {}, {})
      .then(() => {
        addToTranscript('user', message);
      })
      .catch((error) => {
        console.error('failed to send message:', error);
      });
  };

  return (
    <div
      className={styles.backgroundImage}
      style={{
        flexGrow: 1,
        borderRadius: '24px 24px 24px 24px',
        margin: '80px',
      }}
    >
      <Help
        children={
          disableAvatar ? (
            <div className={styles.avatar}>Avatar</div>
          ) : (
            <div>
              {videoLoaded && (
                <button
                  onClick={handleEndConversation}
                  className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold "
                  style={{
                    zIndex: 1,
                    fontWeight: '400',
                    fontSize: '16px',
                    lineHeight: '20.8px',
                    top: '56px',
                    left: '56px',
                    padding: '12px 24px 12px 24px',
                    gap: '8px',
                    borderRadius: '24px',
                    opacity: '0px',
                    color: '#2E0055',
                  }}
                >
                  End conversation
                </button>
              )}
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
            </div>
          )
        }
        transcript={transcript}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default DigitalPersona;
