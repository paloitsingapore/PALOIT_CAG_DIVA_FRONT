import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../components/organisms/Home';

// Mock the components used in Home
jest.mock('next/dynamic', () => () => {
    const MockFaceDetection = () => (
        <div data-testid="face-detection">Face Detection Component</div>
    );
    return MockFaceDetection;
});

jest.mock('@AssistedWayinding/components/organisms/DigitalPersona', () => {
    return function MockDigitalPersona() {
        return (
            <div data-testid="digital-persona">Digital Persona Component</div>
        );
    };
});

describe('Home', () => {
    it('renders without crashing', () => {
        render(<Home />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
