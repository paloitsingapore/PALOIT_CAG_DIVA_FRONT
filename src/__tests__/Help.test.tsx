import React from 'react';
import { render, screen } from '@testing-library/react';
import Help from '@AssistedWayinding/components/organisms/Help';

describe('Help', () => {
    const mockTranscript = [
        {
            source: 'user' as 'user',
            text: 'Hello',
            timestamp: '2023-04-01T12:00:00Z',
        },
        {
            source: 'persona' as 'persona',
            text: 'Hi there!',
            timestamp: '2023-04-01T12:00:01Z',
        },
    ];

    const mockOnSendMessage = jest.fn();

    it('renders Help component correctly', () => {
        render(
            <Help transcript={mockTranscript} onSendMessage={mockOnSendMessage}>
                <div>Child Component</div>
            </Help>,
        );

        expect(screen.getByText('Child Component')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
});
