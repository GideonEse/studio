'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader, Sparkles, TriangleAlert } from 'lucide-react';
import { getSmartResponse } from '@/app/(main)/inquiries/[id]/actions';
import { Badge } from './ui/badge';

type Props = {
  inquiryText: string;
};

export function SmartResponse({ inquiryText }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    suggestedResponse: string;
    flaggedKeywords: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await getSmartResponse({ inquiry: inquiryText });
      setResult(response);
    } catch (e) {
      setError('Failed to generate response. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate Smart Response
      </Button>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
            {result.flaggedKeywords.length > 0 && (
                 <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Immediate Review Suggested</AlertTitle>
                    <AlertDescription>
                        The following keywords/phrases were flagged:
                        <div className="flex flex-wrap gap-2 mt-2">
                            {result.flaggedKeywords.map((keyword, i) => (
                                <Badge key={i} variant="destructive">{keyword}</Badge>
                            ))}
                        </div>
                    </AlertDescription>
                </Alert>
            )}
           
            <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Suggested Response</AlertTitle>
                <AlertDescription>
                <Textarea
                    readOnly
                    value={result.suggestedResponse}
                    className="mt-2 min-h-[120px] bg-background"
                />
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
