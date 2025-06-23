'use server';

import {
  generateSmartResponse,
  type SmartResponseInput,
} from '@/ai/flows/smart-response-tool';

export async function getSmartResponse(input: SmartResponseInput) {
  try {
    const result = await generateSmartResponse(input);
    return result;
  } catch (error) {
    console.error('Error generating smart response:', error);
    throw new Error('Failed to generate smart response.');
  }
}
