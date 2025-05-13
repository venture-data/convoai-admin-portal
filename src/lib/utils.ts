import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseErrorMessage(error: string): string {
  try {
    if (error.includes('message:')) {
      const messageJson = error.split('message: ')[1];
      const parsedError = JSON.parse(messageJson);
      
      if (parsedError.detail) {
        const phoneNumberMatch = parsedError.detail.match(/\["([^"]+)"\]/);
        const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1] : '';
        if (parsedError.detail.includes('Conflicting inbound SIP Trunks')) {
          return `Phone number "${phoneNumber}" is already in use by another trunk. Please use a different number.`;
        }
        const cleanMessage = parsedError.detail
          .replace(/\([^)]*\)/g, '')
          .replace(/Failed to create complete SIP setup: /i, '')
          .replace(/Failed to create inbound SIP trunk: /i, '')
          .replace(/invalid_argument,/i, '')
          .replace(/without AllowedNumbers set/i, '')
          .trim();
          
        return cleanMessage;
      }
    }
    return 'Failed to create SIP trunk. Please try again.';
  } catch (e) {
    console.error('Error parsing error message:', e);
    return 'An unexpected error occurred. Please try again.';
  }
}