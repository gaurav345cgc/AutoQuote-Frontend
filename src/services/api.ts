// Frontend API Service Layer
// This file ONLY makes HTTP requests to the backend
// NO MongoDB code, NO business logic - just fetch() calls

const API_BASE_URL = 'http://localhost:3011/api';

export interface SavedQuotation {
  _id: string;
  company: any;
  products: any[];
  emailText?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch all quotations from backend
export const fetchQuotations = async (): Promise<SavedQuotation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/quotations`);

    if (!response.ok) {
      throw new Error('Failed to fetch quotations');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }
};

// Fetch a single quotation by ID
export const fetchQuotationById = async (id: string): Promise<SavedQuotation> => {
  try {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch quotation');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw error;
  }
};

// Update a quotation
export const updateQuotation = async (id: string, data: any): Promise<SavedQuotation> => {
  try {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update quotation');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating quotation:', error);
    throw error;
  }
};

// Delete a quotation
export const deleteQuotation = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete quotation');
    }
  } catch (error) {
    console.error('Error deleting quotation:', error);
    throw error;
  }
};
