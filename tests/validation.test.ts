import { describe, test, expect } from 'vitest';
import { validateTicketNumber, validateCupBarcode, validateFoodOrder } from '../src/utils/validation';

describe('Validation Utilities', () => {
  
  test('validateTicketNumber should check FIFA 2026 ticket structures correctly', () => {
    expect(validateTicketNumber('FIFA-2026-ABC1234')).toBe(true);
    expect(validateTicketNumber('FIFA-2026-XYZ98765')).toBe(true);
    
    // Failures
    expect(validateTicketNumber('FIFA-1234-ABC1234')).toBe(false);
    expect(validateTicketNumber('FIFA-2026-')).toBe(false);
    expect(validateTicketNumber('ABC-2026-ABC1234')).toBe(false);
  });

  test('validateCupBarcode should accept valid eco barcodes', () => {
    expect(validateCupBarcode('GREEN-CUP-1234567890')).toBe(true);
    expect(validateCupBarcode('GREEN-CUP-0000000000')).toBe(true);
    
    // Failures
    expect(validateCupBarcode('CUP-1234567890')).toBe(false);
    expect(validateCupBarcode('GREEN-CUP-12345')).toBe(false);
    expect(validateCupBarcode('GREEN-CUP-abcdefghij')).toBe(false);
  });

  test('validateFoodOrder should validate food items, quantities, and locations', () => {
    const validOrder = {
      item: 'World Cup Double Burger',
      quantity: 2,
      customerName: 'John Doe',
      seatLocation: 'A102-12'
    };
    
    const result = validateFoodOrder(validOrder);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();

    // Invalid quantity
    const invalidQty = { ...validOrder, quantity: 15 };
    expect(validateFoodOrder(invalidQty).isValid).toBe(false);

    // Invalid location format
    const invalidLoc = { ...validOrder, seatLocation: 'invalid' };
    expect(validateFoodOrder(invalidLoc).isValid).toBe(false);

    // Empty name
    const invalidName = { ...validOrder, customerName: 'J' }; // too short
    expect(validateFoodOrder(invalidName).isValid).toBe(false);
  });

});
