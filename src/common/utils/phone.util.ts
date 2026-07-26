/**
 * Normalizes phone numbers to standard format (starting with '62' instead of '0' or '+62').
 * Removes all non-digit characters.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return phone;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Replace leading '0' with '62'
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  
  return cleaned;
}

/**
 * Validates whether a phone number matches standard Indonesian format.
 * Expects the number to be normalized first (starts with 62, total length 10 to 16 digits).
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  
  // Must start with 62, followed by 8 to 14 digits (total length 10 to 16 digits)
  return /^62\d{8,14}$/.test(phone);
}
