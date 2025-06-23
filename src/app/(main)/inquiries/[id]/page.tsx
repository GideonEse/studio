'use client';

import { inquiries } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SmartResponse } from "@/components/smart-response";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const inquiry = inquiries.find((i) => i.id === params.id);
  const [responseText, setResponseText] = useState('');

  const handleSendResponse = () => {
    if (!inquiry) return;

    if (!responseText.trim()) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Response cannot be empty."
        });
        return;
    }

    inquiry.response = responseText;
    inquiry.status = 'Resolved';

    toast({
        title: "Response Sent",
        description: "The inquiry has been marked as resolved."
    });

    router.push('/admin/dashboard');
  };

  if (!inquiry) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Inquiry not found</h1>
            <p>The requested inquiry could not be located.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
            </Button>
            <h1 className="text-3xl font-bold font-headline">Inquiry Details</h1>
        </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {inquiry.studentName}</p>
                    <p><strong>Date Submitted:</strong> {format(inquiry.date, "PPP")}</p>
                    <p><strong>Status:</strong> <Badge variant={inquiry.status === 'Resolved' ? 'secondary' : 'outline'}>{inquiry.status}</Badge></p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">{inquiry.question}</p>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Respond to Inquiry</CardTitle>
                    <CardDescription>Use the Smart Response tool to assist in drafting your reply.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <SmartResponse inquiryText={inquiry.question} onResponseGenerated={setResponseText} />
                   <Separator />
                   <div className="space-y-2">
                        <Label htmlFor="response">Your Final Response</Label>
                        <Textarea 
                            id="response" 
                            placeholder="Enter your response here..." 
                            className="min-h-[150px]"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                        />
                   </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSendResponse}>Send Response & Mark as Resolved</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
