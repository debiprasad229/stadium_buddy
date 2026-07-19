/**
 * Validation Utilities for ArenaOS 2026
 * Validates inputs for stadium check-in, pre-ordering, and barcode scans.
 */

/**
 * Validates FIFA match ticket formats.
 * Expected format: FIFA-2026-XXXXXX (where X is alphanumeric)
 */
export function validateTicketNumber(ticket: string): boolean {
  if (!ticket) return false;
  const ticketRegex = /^FIFA-2026-[A-Z0-9]{6,8}$/i;
  return ticketRegex.test(ticket.trim());
}

/**
 * Validates sustainability cup barcode scans.
 * Expected format: GREEN-CUP-[10-digit number]
 */
export function validateCupBarcode(barcode: string): boolean {
  if (!barcode) return false;
  const barcodeRegex = /^GREEN-CUP-\d{10}$/;
  return barcodeRegex.test(barcode.trim());
}

/**
 * Validates email addresses (e.g. for registration/newsletter updates)
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length <= 128 && emailRegex.test(email);
}

/**
 * Validates concession food orders.
 */
export interface FoodOrderInput {
  item: string;
  quantity: number;
  customerName: string;
  seatLocation: string;
}

export function validateFoodOrder(order: FoodOrderInput): { isValid: boolean; error?: string } {
  if (!order.item || order.item.trim().length === 0) {
    return { isValid: false, error: 'Food item is required.' };
  }
  if (!order.quantity || order.quantity <= 0 || order.quantity > 10) {
    return { isValid: false, error: 'Quantity must be between 1 and 10.' };
  }
  if (!order.customerName || order.customerName.trim().length < 2 || order.customerName.length > 50) {
    return { isValid: false, error: 'Customer name must be between 2 and 50 characters.' };
  }
  if (!order.seatLocation || !/^[A-Z]\d{1,3}-\d{1,3}$/i.test(order.seatLocation.trim())) {
    return { isValid: false, error: 'Seat location must be in Section-Row format (e.g., A102-12).' };
  }
  return { isValid: true };
}
