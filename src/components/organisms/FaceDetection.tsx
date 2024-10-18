import React, { useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const width = 500;
const height = 500;

interface FaceDetectionProps {
    onFaceDetected: (base64Image: string) => void;
}

const FaceDetectionComponent: React.FC<FaceDetectionProps> = ({
    onFaceDetected,
}) => {
    const convertToBase64 = (
        image: HTMLCanvasElement | HTMLImageElement | ImageBitmap,
    ): string => {
        const canvas = document.createElement('canvas');
        canvas.width =
            image instanceof HTMLCanvasElement ? image.width : image.width;
        canvas.height =
            image instanceof HTMLCanvasElement ? image.height : image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        return canvas.toDataURL('image/jpeg').split(',')[1];
    };

    const handleOnResults = useCallback(
        (results: FaceDetection.Results) => {
            if (
                results.detections &&
                results.detections.length > 0 &&
                results.image
            ) {
                const base64Image = convertToBase64(results.image);
                onFaceDetected(base64Image);
            }
        },
        [onFaceDetected],
    );

    const { webcamRef } = useFaceDetection({
        faceDetectionOptions: {
            model: 'short',
        },
        faceDetection: new FaceDetection.FaceDetection({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
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

export default FaceDetectionComponent;
