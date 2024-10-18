import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DigitalPersona from '../components/organisms/DigitalPersona';

// Mock the @soulmachines/smwebsdk package
jest.mock('@soulmachines/smwebsdk', () => ({
    Scene: jest.fn().mockImplementation(() => ({
        onMessage: jest.fn(),
        startVideo: jest.fn(),
        stopVideo: jest.fn(),
        connect: jest.fn().mockResolvedValue(undefined),
    })),
    Persona: jest.fn().mockImplementation(() => ({
        conversationSend: jest.fn().mockResolvedValue(undefined),
    })),
}));

describe('DigitalPersona', () => {
    const mockProps = {
        personaId: 'test-persona',
        disableAvatar: false,
        user: { id: 'test-user', name: 'Test User' },
        onEndConversation: jest.fn(),
        apiKey: 'test-api-key',
    };

    let mockScene: any;
    let mockPersona: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockScene = {
            onMessage: jest.fn(),
            startVideo: jest.fn(),
            stopVideo: jest.fn(),
            connect: jest.fn().mockResolvedValue(undefined),
        };
        mockPersona = {
            conversationSend: jest.fn().mockResolvedValue(undefined),
        };
        (require('@soulmachines/smwebsdk').Scene as jest.Mock).mockReturnValue(
            mockScene,
        );
        (
            require('@soulmachines/smwebsdk').Persona as jest.Mock
        ).mockReturnValue(mockPersona);
    });

    it('renders without crashing and initializes Scene', async () => {
        await act(async () => {
            render(<DigitalPersona {...mockProps} />);
        });
        expect(require('@soulmachines/smwebsdk').Scene).toHaveBeenCalledWith(
            expect.any(Object),
        );
        expect(mockScene.connect).toHaveBeenCalled();
    });
});
