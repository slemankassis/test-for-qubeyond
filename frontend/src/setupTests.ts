// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import "@testing-library/jest-dom";

// Declare the types for window.ENV
declare global {
  interface Window {
    ENV: {
      VITE_API_URL: string;
    };
  }
}

// Mock the environment variables
window.ENV = {
  VITE_API_URL: "http://localhost:3007",
};

// Mock import.meta.env
// @ts-ignore
(global as any).import = {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:3007",
    },
  },
};

// Mock fetch API
(global as any).fetch = jest.fn();

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

export {};
