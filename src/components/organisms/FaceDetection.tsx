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

const WebcamDemo: React.FC = () => {
  const [faceDetectionStartTime, setFaceDetectionStartTime] = useState<number | null>(null);
  const [imageSent, setImageSent] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendImageToAPI = useCallback(async (image: HTMLCanvasElement | HTMLImageElement | ImageBitmap) => {
    if (!imageSent) {
      console.log('Sending image to API');
      
      let base64Image = '';
      if (image instanceof HTMLCanvasElement) {
        // Convert canvas to base64
        base64Image = image.toDataURL('image/jpeg').split(',')[1];
      } else if (image instanceof HTMLImageElement) {
        // Create a canvas to draw the image and convert to base64
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      } else if ('ImageBitmap' in window && image instanceof ImageBitmap) {
        // Create a canvas to draw the ImageBitmap and convert to base64
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      }

      if (base64Image) {
        try {
          console.log(`base64Image: ${base64Image}`);
          // const response = await fetch('your-api-endpoint', {
          //   method: 'POST',
          //   body: JSON.stringify({ image: base64Image }),
          //   headers: { 'Content-Type': 'application/json' },
          // });
          // const data = await response.json();
          // console.log('API response:', data);
          setImageSent(true);
        } catch (error) {
          console.error('Error sending image to API:', error);
        }
      } else {
        console.error('Failed to convert image to base64');
      }
    }
  }, [imageSent]);

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

  const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
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
    <div>
      <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p>
      <p>{`Image sent: ${imageSent}`}</p>
      <div style={{ width, height, position: 'relative' }}>
        {boundingBox.map((box: BoundingBox, index: number) => (
          <div
            key={`${index + 1}`}
            style={{
              border: '4px solid red',
              position: 'absolute',
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          />
        ))}
        <Webcam
          ref={webcamRef}
          forceScreenshotSourceSize
          style={{
            height,
            width,
            position: 'absolute',
          }}
        />
      </div>
    </div>
  );
};

export default WebcamDemo;