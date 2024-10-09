import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const width = 500;
const height = 500;

interface BoundingBox {
  xCenter: number;
  yCenter: number;
  width: number;
  height: number;
}

interface PassengerData {
  rekognition_collection_id: string;
  userId: string;
  imageUrls: string[];
  name: string;
  gender: string;
  faceIds: string[];
  age: number;
}

export interface FaceRecognitionResponse {
  message: string;
  passengerData: PassengerData;
}

interface FaceRecognitionProps {
  onFaceRecognized: (apiResponse: FaceRecognitionResponse) => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ onFaceRecognized }) => {
  const [faceDetectionStartTime, setFaceDetectionStartTime] = useState<number | null>(null);
  const [imageSent, setImageSent] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendImageToAPI = useCallback(async (image: HTMLCanvasElement | HTMLImageElement | ImageBitmap) => {
    if (!imageSent) {
      console.log('Sending image to API');
      
      let base64Image = '';
      if (image instanceof HTMLCanvasElement) {
        base64Image = image.toDataURL('image/jpeg').split(',')[1];
      } else if (image instanceof HTMLImageElement) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      } else if ('ImageBitmap' in window && image instanceof ImageBitmap) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      }

      if (base64Image) {
        try {
          setImageSent(true);
          const response = await fetch('https://ijiv62tdzd.execute-api.ap-southeast-2.amazonaws.com/prod/recognize', {
            method: 'POST',
            body: JSON.stringify({ image: base64Image }),
            headers: { 'Content-Type': 'application/json' },
          });
          const data: FaceRecognitionResponse = await response.json();
          
          onFaceRecognized(data);
        } catch (error) {
          console.error('Error sending image to API:', error);
        }
      } else {
        console.error('Failed to convert image to base64');
      }
    }
  }, [imageSent, onFaceRecognized]);

  const handleOnResults = useCallback((results: FaceDetection.Results) => {
    if (results.detections && results.detections.length > 0) {
      if (faceDetectionStartTime === null) {
        setFaceDetectionStartTime(Date.now());
      } else if (!imageSent) {
        const elapsedTime = Date.now() - faceDetectionStartTime;
        if (elapsedTime >= 3000) {
          if (timeoutRef.current === null) {
            timeoutRef.current = setTimeout(() => {
              if (results.image) {
                sendImageToAPI(results.image);
              }
              timeoutRef.current = null;
            }, 0);
          }
        }
      }
    } else {
      setImageSent(false);
      setFaceDetectionStartTime(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [faceDetectionStartTime, sendImageToAPI, imageSent]);

  const { webcamRef } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }: CameraOptions) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
    handleOnResults,
  });

  return (
    <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
      <Webcam
        ref={webcamRef}
        forceScreenshotSourceSize
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default FaceRecognition;