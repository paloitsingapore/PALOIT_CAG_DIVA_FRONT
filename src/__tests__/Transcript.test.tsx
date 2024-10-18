import React from 'react';
import { render, screen } from '@testing-library/react';
import Transcript, {
    TranscriptEntry,
} from '@AssistedWayinding/components/molecules/Transcript';

describe('Transcript', () => {
    const mockTranscript: TranscriptEntry[] = [
        { source: 'user', text: 'Hello', timestamp: '2023-04-01T12:00:00Z' },
        {
            source: 'persona',
            text: 'Hi there!',
            timestamp: '2023-04-01T12:00:01Z',
        },
    ];

    it('renders transcript entries correctly', () => {
        render(
            <Transcript transcript={mockTranscript} onSendMessage={() => {}} />,
        );

        // Check if user message is rendered
        expect(screen.getByText('Hello')).toBeInTheDocument();

        // Check if persona message is rendered
        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
});
