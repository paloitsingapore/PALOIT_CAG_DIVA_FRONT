import React from 'react';
import { render, act } from '@testing-library/react';
import Page from '@AssistedWayinding/app/page';

// Mock the NoSSRHome component
jest.mock('@AssistedWayinding/components/organisms/Home', () => () => (
    <div>Page Component</div>
));

describe('Page', () => {
    it('renders without crashing', async () => {
        // Wrap in act to ensure state updates are flushed
        await act(async () => {
            render(<Page />);
        });

        const { container } = await act(async () => render(<Page />));

        // Check if the body contains a div with the expected content
        expect(container.firstElementChild).toBeInTheDocument();
        expect(container.firstElementChild?.tagName).toBe('DIV');
        expect(container.firstElementChild?.textContent).toBe('Page Component');

        // Alternatively, match the exact innerHTML produced by the mock
        expect(container.innerHTML).toBe('<div>Page Component</div>');
    });
});
