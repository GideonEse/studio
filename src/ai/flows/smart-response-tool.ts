'use server';

/**
 * @fileOverview A smart response tool that analyzes health inquiries and suggests response templates.
 *
 * - generateSmartResponse - A function that generates a smart response based on the inquiry.
 * - SmartResponseInput - The input type for the generateSmartResponse function.
 * - SmartResponseOutput - The return type for the generateSmartResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartResponseInputSchema = z.object({
  inquiry: z
    .string()
    .describe('The health inquiry from the student.'),
});
export type SmartResponseInput = z.infer<typeof SmartResponseInputSchema>;

const SmartResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('The AI-suggested response template for the inquiry.'),
  flaggedKeywords: z.array(z.string()).describe('Keywords or phrases that require immediate review.'),
});
export type SmartResponseOutput = z.infer<typeof SmartResponseOutputSchema>;

export async function generateSmartResponse(input: SmartResponseInput): Promise<SmartResponseOutput> {
  return smartResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartResponsePrompt',
  input: {schema: SmartResponseInputSchema},
  output: {schema: SmartResponseOutputSchema},
  prompt: `You are a medical assistant tasked with drafting responses to student health inquiries.

  Analyze the inquiry and suggest a response template that is efficient and adaptable.
  Also, identify and flag any keywords or concerning phrases that require immediate review by medical staff.

  Inquiry: {{{inquiry}}}

  Format your response as a JSON object with "suggestedResponse" and "flaggedKeywords" fields.
  `,
});

const smartResponseFlow = ai.defineFlow(
  {
    name: 'smartResponseFlow',
    inputSchema: SmartResponseInputSchema,
    outputSchema: SmartResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
