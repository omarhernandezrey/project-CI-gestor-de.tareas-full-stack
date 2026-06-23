import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ data: [] }) })
  ));
});

describe('App - Gestor de Tareas', () => {
  it('renderiza el título principal', async () => {
    render(<App />);
    expect(screen.getByText(/Gestor de Tareas/i)).toBeInTheDocument();
  });

  it('renderiza las tres tarjetas de estadísticas', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Pendientes/i)).toBeInTheDocument();
      expect(screen.getByText(/Completadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Total/i)).toBeInTheDocument();
    });
  });

  it('renderiza el input para crear tareas', async () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Nueva tarea/i)).toBeInTheDocument();
  });
});
