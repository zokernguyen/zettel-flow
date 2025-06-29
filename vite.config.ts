/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [], // omit if not React
  test: {
    globals: true,           // so you can use describe, it, expect without imports
    environment: 'node',    // simulates browser environment for tests
    //setupFiles: ['./src/setupTests.ts'], // optional setup file before tests
  },
});
