'use client';

import { useState, useCallback, useRef } from 'react';
import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import FaceDetectionComponent from '@AssistedWayinding/components/organisms/FaceDetection';
import { Wifi, Smartphone } from 'lucide-react';
import styles from '@AssistedWayinding/styles/Help.module.css';
export interface PassengerData {
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
    const [faceDetectionStartTime, setFaceDetectionStartTime] = useState<
        number | null
    >(null);
    const [imageSent, setImageSent] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [user, setUser] = useState<PassengerData | undefined>(undefined);

    const sendImageToAPI = useCallback(
        async (base64Image: string) => {
            if (!imageSent) {
                console.log('Sending image to API');

                try {
                    setImageSent(true);
                    const response = await fetch(
                        'https://ijiv62tdzd.execute-api.ap-southeast-2.amazonaws.com/prod/recognize',
                        {
                            method: 'POST',
                            body: JSON.stringify({ image: base64Image }),
                            headers: { 'Content-Type': 'application/json' },
                        },
                    );
                    const data: FaceRecognitionResponse = await response.json();

                    setPersonaId(data.passengerData.userId);
                    setUser(data.passengerData);
                } catch (error) {
                    console.error('Error sending image to API:', error);
                }
            }
        },
        [imageSent],
    );

    const handleFaceDetected = useCallback(
        (base64Image: string) => {
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
        },
        [faceDetectionStartTime, sendImageToAPI, imageSent],
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgb(62, 0, 91)',
                height: '100vh',
            }}
        >
            <FaceDetectionComponent onFaceDetected={handleFaceDetected} />
            <DigitalPersona
                personaId={personaId}
                disableAvatar={false}
                user={user}
            />
            {/* <div
                className={`p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 ${styles.fontHind}`}
            >
                <div className=" bg-purple-700 w-full sm:w-1/2 bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="p-4 flex items-center justify-center flex-col border-r border-black">
                        <Wifi className="w-8 h-8 text-white" />
                        <span className="text-xs mt-1 text-white">Wi-Fi</span>
                    </div>
                    <div className="p-4 flex-grow">
                        <p className="font-medium text-white">
                            Tap your phone below to connect<br></br> to our free
                            Wi-Fi
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="p-4 flex items-center justify-center flex-col border-r border-black">
                        <Smartphone className="w-8 h-8 text-white" />
                        <span className="text-xs mt-1 text-white">
                            Download
                        </span>
                    </div>
                    <div className="p-4 flex-grow">
                        <p className="font-medium text-white">
                            Tap your phone below to continue receiving
                            assistance from Mei
                        </p>
                    </div>
                </div>
            </div> */}

            <div
                className={`p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 ${styles.fontHind}`}
            >
                <div className="bg-purple-700 w-full sm:w-1/2 bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="p-8 flex items-center justify-center flex-col border-r border-black">
                        <Wifi className="w-12 h-12 text-white" />{' '}
                        {/* Increased icon size */}
                        <span
                            className="text-sm mt-2 text-white"
                            style={{
                                fontFamily: 'Hind',
                                fontWeight: 200,
                                fontSize: '48px',
                                lineHeight: '57.6px',
                            }}
                        >
                            Wi-Fi
                        </span>{' '}
                        {/* Increased text size */}
                    </div>
                    <div className="p-4 flex-grow">
                        <p className="font-medium text-white">
                            Tap your phone below to connect
                            <br /> to our free Wi-Fi
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="p-8 flex items-center justify-center flex-col border-r border-black">
                        <Smartphone className="w-12 h-12 text-white" />{' '}
                        {/* Increased icon size */}
                        <span
                            className="text-sm mt-2 text-white"
                            style={{
                                fontFamily: 'Hind',
                                fontWeight: 200,
                                fontSize: '48px',
                                lineHeight: '57.6px',
                            }}
                        >
                            Download
                        </span>{' '}
                        {/* Increased text size */}
                    </div>
                    <div className="p-4 flex-grow">
                        <p className="font-medium text-white">
                            Tap your phone below to continue receiving
                            assistance from Mei
                        </p>
                    </div>
                </div>
            </div>
            {/* <div className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="w-full sm:w-1/2 max-w-md bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="bg-fuchsia-700 p-4 flex items-center justify-center">
                        <Wifi className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-4 bg-fuchsia-200 flex-grow">
                        <p className="text-black-900 font-medium">
                            Tap your phone below to connect to our free Wi-Fi
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 max-w-md bg-purple-600 rounded-2xl overflow-hidden flex">
                    <div className="bg-fuchsia-700 p-4 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-4 bg-fuchsia-200 flex-grow">
                        <p className="text-black-900 font-medium">
                            Tap your phone below to continue receiving
                            assistance from Mei
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
