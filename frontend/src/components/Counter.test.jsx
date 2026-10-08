import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter (integration)', () => {
  it('muestra count = 0 al inicio', () => {
    // Arrange
    render(<Counter />);

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent('count = 0');
  });

  it('incrementa en 1 al pulsar Increment', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Counter />);

    // Act
    await user.click(screen.getByRole('button', { name: /increment/i }));

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent('count = 1');
  });

  it('acumula varios clics', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });

    // Act
    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent('count = 3');
  });
});
