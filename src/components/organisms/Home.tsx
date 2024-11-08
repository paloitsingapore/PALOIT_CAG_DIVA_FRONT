'use client';

import { useState, useCallback, useRef, Suspense } from 'react';
import React from 'react';
import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import { Wifi } from 'lucide-react';
import styles from '@AssistedWayinding/styles/Help.module.css';
import '../../app/i18n';
import { useTranslation } from 'react-i18next';

import {
    API_ENDPOINTS,
    SOUL_MACHINE_API_KEY,
} from '@AssistedWayinding/config/apiConfig';
import dynamic from 'next/dynamic';

// Dynamically import FaceDetectionComponent
const FaceDetectionComponent = dynamic(
    () => import('@AssistedWayinding/components/organisms/FaceDetection'),
    {
        ssr: false, // This will prevent server-side rendering
    },
);
export type PassengerData = {
    changi_app_user_id: string;
    passengerId: string;
    imageUrls: string[];
    name: string;
    language: 'en' | 'es' | 'zh' | undefined;
    gate: string;
    has_lounge_access: boolean;
    rekognition_collection_id: string;
    userId: string;
    flight_time: string;
    lounge_name: string;
    next_flight_id: string;
    dateOfBirth: string;
    accessibilityPreferences: {
        increaseFontSize: boolean;
        wheelchairAccessibility: boolean;
    };
    faceIds: string[];
    airline: string;
};

type FaceRecognitionResponse = {
    message: string;
    passengerData: PassengerData;
};

const Home: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [personaId, setPersonaId] = useState<string>('unknown');
    const [faceDetectionStartTime, setFaceDetectionStartTime] = useState<
        number | null
    >(null);
    const [imageSent, setImageSent] = useState(false);
    const [user, setUser] = useState<PassengerData | undefined>(undefined);
    const [apiKey, setApiKey] = useState<string>(SOUL_MACHINE_API_KEY.en);
    const sendImageToAPI = useCallback(
        async (base64Image: string) => {
            if (imageSent) return;
            console.log('Sending image to API');

            try {
                setFaceDetectionStartTime(null);
                console.log('Fetching from API:', API_ENDPOINTS.RECOGNIZE);
                const response = await fetch(API_ENDPOINTS.RECOGNIZE, {
                    method: 'POST',
                    body: JSON.stringify({ image: base64Image }),
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log('API response status:', response.status);
                const data: FaceRecognitionResponse = await response.json();
                console.log('API response data:', data);
                if (data.passengerData) {
                    console.log('Passenger data received:', data.passengerData);
                    console.log('personaId:', personaId);
                    console.log(
                        'data.passengerData.changi_app_user_id:',
                        data.passengerData.userId,
                    );
                    if (data.passengerData.userId === personaId) {
                        console.log('Same person detected, returning');
                        return;
                    }
                    setUser(data.passengerData);
                    setApiKey(
                        SOUL_MACHINE_API_KEY[data.passengerData.language] ||
                            SOUL_MACHINE_API_KEY.en,
                    );
                    setPersonaId(data.passengerData.userId);
                    i18n.changeLanguage(data.passengerData.language);
                }
            } catch (error) {
                console.error('Error sending image to API:', error);
            }
        },
        [i18n, imageSent, personaId],
    );

    const handleFaceDetected = useCallback(
        (base64Image: string) => {
            if (faceDetectionStartTime === null) {
                console.log('Setting faceDetectionStartTime');
                return setFaceDetectionStartTime(Date.now());
            }

            if (!imageSent) {
                const elapsedTime = Date.now() - faceDetectionStartTime;
                // console.log('Elapsed time since face detection:', elapsedTime);
                if (elapsedTime >= 1000) {
                    console.log('Elapsed time >= 1000ms, sending image to API');
                    sendImageToAPI(base64Image);
                    setImageSent(true);
                }
                setTimeout(() => {
                    setImageSent(false);
                }, 5000);
            }
        },
        [faceDetectionStartTime, sendImageToAPI, imageSent],
    );

    const handleEndConversation = () => {
        setPersonaId('unknown');
        setUser(undefined);
        setImageSent(false);
        setFaceDetectionStartTime(null);
    };

    return (
        <div
            className={styles.homeLayout}
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#2e0055',
                height: '100vh',
            }}
        >
            <FaceDetectionComponent onFaceDetected={handleFaceDetected} />
            <DigitalPersona
                personaId={personaId}
                disableAvatar={false}
                user={user}
                onEndConversation={handleEndConversation}
                apiKey={apiKey}
            />

            <div className={styles.flexContainer}>
                <div className={styles.bottomCard}>
                    <div className={styles.bottomCardSection}>
                        <Wifi className={styles.bottomCardicon} />
                        <span className={styles.bottomCardTextLarge}>
                            {t('wifiTitle')}
                        </span>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <p className={styles.bottomCardTextMedium}>
                            {t('wifiDescription')}
                        </p>
                    </div>
                </div>
                <div className={styles.bottomCard}>
                    <div className={styles.bottomCardSection}>
                        <svg
                            viewBox="0 0 29 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.bottomCardSvgIcon}
                        >
                            <path
                                d="M0 40.3341C0 43.7207 2.38894 45.9783 5.9614 45.9783H22.2019C25.7742 45.9783 28.1633 43.7207 28.1633 40.3341V5.64419C28.1633 2.25767 25.7742 0 22.2019 0H5.9614C2.38894 0 0 2.25767 0 5.64419V40.3341ZM3.52863 38.6193V7.35915H24.6347V38.6193H3.52863ZM14.1145 43.8293C13.0625 43.8293 12.2077 42.9825 12.2077 41.9405C12.2077 40.9202 13.0625 40.0736 14.1145 40.0736C15.1446 40.0736 15.9994 40.9202 15.9994 41.9405C15.9994 42.9825 15.1446 43.8293 14.1145 43.8293ZM9.92836 3.79896C9.92836 3.29967 10.279 2.97405 10.7612 2.97405H17.424C17.9061 2.97405 18.2568 3.29967 18.2568 3.79896C18.2568 4.29825 17.9061 4.60219 17.424 4.60219H10.7612C10.279 4.60219 9.92836 4.29825 9.92836 3.79896Z"
                                fill="white"
                            />
                        </svg>
                        <span className={styles.bottomCardTextLarge}>
                            {t('downloadTitle')}
                        </span>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <p className={styles.bottomCardTextMedium}>
                            {t('downloadDescription')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomeWrapper: React.FC = () => {
    return (
        <Suspense fallback="Loading...">
            <Home />
        </Suspense>
    );
};

export default HomeWrapper;
