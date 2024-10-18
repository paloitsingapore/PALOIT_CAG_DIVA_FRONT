require('@testing-library/jest-dom');
// jest.setup.js

// Mock console.warn to ignore specific warnings
const originalWarn = console.warn;
console.warn = (...args) => {
    if (
        args[0].includes(
            'react-i18next:: You will need to pass in an i18next instance by using initReactI18next',
        )
    ) {
        return;
    }
    originalWarn(...args);
};

// Mock console.error to ignore specific errors
const originalError = console.error;
console.error = (...args) => {
    if (
        args[0].includes(
            'Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`',
        )
    ) {
        return;
    }
    originalError(...args);
};
