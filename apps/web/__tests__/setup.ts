import "@testing-library/jest-dom";

// mock localStorage with proper jest mock functions
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// mock fetch globally
global.fetch = jest.fn();

// reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
