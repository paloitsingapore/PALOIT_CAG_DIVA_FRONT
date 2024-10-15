'use client';

import { useState, useCallback, useRef } from 'react';
import DigitalPersona from '@AssistedWayinding/components/organisms/DigitalPersona';
import FaceDetectionComponent from '@AssistedWayinding/components/organisms/FaceDetection';
import { Wifi } from 'lucide-react';
import phoneIcon from '@AssistedWayinding/public/images/phone_icon.svg';
import styles from '@AssistedWayinding/styles/Help.module.css';
export interface PassengerData {
  changi_app_user_id: string;
  passengerId: string;
  imageUrls: string[];
  name: string;
  language: string;
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

  const handleEndConversation = () => {
    setPersonaId('unknown');
    setUser(undefined);
    setImageSent(false);
    setFaceDetectionStartTime(null);
  };

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
        onEndConversation={handleEndConversation}
      />

      <div
        className={`p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-purple-950 ${styles.fontHind}`}
      >
        <div
          className="bg-purple-700 w-full sm:w-1/2 bg-purple-600 rounded-3xl overflow-hidden flex"
          style={{
            backgroundColor: '#6B2BA0',
          }}
        >
          <div className="p-8 flex items-center justify-center flex-col border-r border-black">
            <Wifi className="w-12 h-12 text-white" />{' '}
            {/* Increased icon size */}
            <span
              className="text-sm mt-2 text-white"
              style={{
                fontFamily: 'Hind',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '24px',
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
        <div
          className="w-full sm:w-1/2 bg-purple-600 rounded-3xl overflow-hidden flex"
          style={{
            backgroundColor: '#6B2BA0',
          }}
        >
          <div className="p-8 flex items-center justify-center flex-col border-r border-black">
            <svg
              width="29"
              height="46"
              viewBox="0 0 29 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 40.3341C0 43.7207 2.38894 45.9783 5.9614 45.9783H22.2019C25.7742 45.9783 28.1633 43.7207 28.1633 40.3341V5.64419C28.1633 2.25767 25.7742 0 22.2019 0H5.9614C2.38894 0 0 2.25767 0 5.64419V40.3341ZM3.52863 38.6193V7.35915H24.6347V38.6193H3.52863ZM14.1145 43.8293C13.0625 43.8293 12.2077 42.9825 12.2077 41.9405C12.2077 40.9202 13.0625 40.0736 14.1145 40.0736C15.1446 40.0736 15.9994 40.9202 15.9994 41.9405C15.9994 42.9825 15.1446 43.8293 14.1145 43.8293ZM9.92836 3.79896C9.92836 3.29967 10.279 2.97405 10.7612 2.97405H17.424C17.9061 2.97405 18.2568 3.29967 18.2568 3.79896C18.2568 4.29825 17.9061 4.60219 17.424 4.60219H10.7612C10.279 4.60219 9.92836 4.29825 9.92836 3.79896Z"
                fill="white"
              />
            </svg>{' '}
            {/* Increased icon size */}
            <span
              className="text-sm mt-2 text-white"
              style={{
                fontFamily: 'Hind',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '24px',
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
    </div>
  );
}
