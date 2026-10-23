import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../auth/AuthContext';
import Header, { SLOGAN } from './Header';

function renderHeader() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('Header', () => {
  it('muestra la marca con su eslogan', () => {
    renderHeader();

    expect(SLOGAN).toBe('Pass it, spark change');
    expect(screen.getByText(SLOGAN)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Kambio/ })).toHaveAttribute('href', '/');
  });

  it('sin sesión, subir un producto pasa por el login y vuelve a la subida', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: '+ Subir producto' })).toHaveAttribute('href', '/login?next=%2Fsubir');
  });
});
