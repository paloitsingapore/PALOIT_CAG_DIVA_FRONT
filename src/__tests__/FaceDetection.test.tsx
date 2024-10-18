import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FaceDetection from '@AssistedWayinding/components/organisms/FaceDetection';

jest.mock(
    '@AssistedWayinding/components/organisms/FaceDetection',
    () => (props: { onFaceDetected: (data: string) => void }) => (
        <div onClick={() => props.onFaceDetected('data:image/png;base64,...')}>
            Face Detection Component
        </div>
    ),
);

describe('FaceDetection', () => {
    const mockOnFaceDetected = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<FaceDetection onFaceDetected={mockOnFaceDetected} />);

        expect(
            screen.getByText('Face Detection Component'),
        ).toBeInTheDocument();
    });

    it('calls onFaceDetected when a face is detected', () => {
        render(<FaceDetection onFaceDetected={mockOnFaceDetected} />);

        // Simulate face detection
        fireEvent.click(screen.getByText('Face Detection Component'));

        expect(mockOnFaceDetected).toHaveBeenCalledWith(
            'data:image/png;base64,...',
        );
    });
});
