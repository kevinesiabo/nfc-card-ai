import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactExchange } from '@/components/actions/ContactExchange';

// Mock fetch
global.fetch = jest.fn();

// Mock toast - override the global mock
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(() => 'mock-toast-id'),
    error: jest.fn(() => 'mock-toast-id'),
    loading: jest.fn(() => 'mock-toast-id'),
  },
}));

describe('ContactExchange Component', () => {
  const mockProps = {
    cardId: 'demo-1',
    cardPhone: '+33 6 12 34 56 78',
    cardProfile: {
      id: 'demo-1',
      name: 'Jean Dupont',
      phone: '+33612345678',
      email: 'jean@example.com',
      position: 'Director',
      company: 'Tech Solutions',
    },
    onExchangeComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('should render contact exchange form', () => {
    render(<ContactExchange {...mockProps} />);
    
    expect(screen.getByText(/Échange de numéros/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Jean Dupont/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\+33 6 12 34 56 78/i)).toBeInTheDocument();
  });

  it('should show card phone number', () => {
    render(<ContactExchange {...mockProps} />);
    
    expect(screen.getByText(mockProps.cardPhone)).toBeInTheDocument();
  });

  it('should require phone number to submit', async () => {
    const user = userEvent.setup();
    render(<ContactExchange {...mockProps} />);
    
    // Use getAllByText and get the button (first one)
    const submitButtons = screen.getAllByText(/Partager mon numéro/i);
    const submitButton = submitButtons.find(btn => btn.tagName === 'BUTTON') || submitButtons[0];
    await user.click(submitButton);

    // Button should be disabled or show error
    expect(submitButton).toBeDisabled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<ContactExchange {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText(/Jean Dupont/i);
    const phoneInput = screen.getByPlaceholderText(/\+33 6 12 34 56 78/i);
    // Use getAllByText and get the button (first one)
    const submitButtons = screen.getAllByText(/Partager mon numéro/i);
    const submitButton = submitButtons.find(btn => btn.tagName === 'BUTTON') || submitButtons[0];

    await user.type(nameInput, 'Test User');
    await user.type(phoneInput, '+33698765432');
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/profiles/demo-1/analytics/contact-exchange'),
        expect.any(Object)
      );
    });
  });

  it('should download vCard automatically on mount', async () => {
    // Mock URL.createObjectURL and document.createElement
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Save original before spying
    const originalCreateElement = document.createElement;
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement.call(document, tagName);
      if (tagName === 'a') {
        // Mock click method for anchor elements
        element.click = jest.fn();
      }
      return element;
    });

    render(<ContactExchange {...mockProps} />);

    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a');
    }, { timeout: 2000 });
    
    createElementSpy.mockRestore();
  });
});

