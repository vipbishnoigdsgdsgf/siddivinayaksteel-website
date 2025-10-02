
/**
 * Obfuscates an email address by showing only first two and last one characters
 * Example: test@example.com -> te******m@example.com
 */
export const obfuscateEmail = (email: string | null | undefined): string => {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email; // Not a valid email format
  
  const [localPart, domain] = parts;
  
  // For the local part, show first 2 chars and last 1, rest are asterisks
  if (localPart.length <= 3) {
    return email; // Too short to meaningfully obfuscate
  }
  
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-1);
  const hiddenPart = '*'.repeat(Math.min(6, localPart.length - 3));
  
  return `${visibleStart}${hiddenPart}${visibleEnd}@${domain}`;
};

/**
 * Obfuscates a phone number by showing only first 2 and last 2 digits
 * Example: 1234567890 -> 12******90
 */
export const obfuscatePhone = (phone: string | null | undefined): string => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length <= 4) {
    return phone; // Too short to meaningfully obfuscate
  }
  
  const visibleStart = cleanPhone.slice(0, 2);
  const visibleEnd = cleanPhone.slice(-2);
  const hiddenPart = '*'.repeat(Math.min(6, cleanPhone.length - 4));
  
  return `${visibleStart}${hiddenPart}${visibleEnd}`;
};
