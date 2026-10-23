import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Desmonta lo renderizado tras cada test para que no se mezclen entre sí
afterEach(() => {
  cleanup();
});
