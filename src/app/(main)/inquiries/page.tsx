'use client';

import React, { useState } from 'react';
import { inquiries } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [question, setQuestion] = useState('');
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Initialize history from mock data, but manage it in state to allow updates
  const [inquiryHistory, setInquiryHistory] = useState(() => 
    currentUser ? inquiries.filter(i => i.studentId === currentUser.id) : []
  );

  React.useEffect(() => {
    if (currentUser) {
        setInquiryHistory(inquiries.filter(i => i.studentId === currentUser.id));
    }
  }, [currentUser]);


  const handleSubmitInquiry = () => {
    if (!question.trim() || !currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Inquiry cannot be empty."
      });
      return;
    }

    const newInquiry = {
      id: `inq_${Date.now()}`,
      studentName: currentUser.name,
      studentId: currentUser.id,
      date: new Date(),
      question: question,
      status: 'Pending' as const,
    };

    // Add to the master list
    inquiries.unshift(newInquiry); 
    // Update local state to trigger re-render
    setInquiryHistory(prev => [newInquiry, ...prev]);

    toast({
      title: "Inquiry Submitted",
      description: "Our staff will respond within 24-48 hours."
    });

    setQuestion('');
    setActiveTab('history');
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Health Inquiries</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="new">New Inquiry</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
            <Card>
                <CardHeader>
                    <CardTitle>Submit a New Inquiry</CardTitle>
                    <CardDescription>
                        Ask a non-urgent health question. Our staff will respond within 24-48 hours.
                        For emergencies, please call 911.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea 
                      placeholder="Type your question here..." 
                      className="min-h-[150px]"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <Button onClick={handleSubmitInquiry}>Submit Inquiry</Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="history">
            <Card>
                <CardHeader>
                <CardTitle>Your Inquiry History</CardTitle>
                <CardDescription>A record of your past questions and responses.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {inquiryHistory.length > 0 ? inquiryHistory.map((inq) => (
                        <TableRow key={inq.id}>
                        <TableCell>{format(inq.date, "PPP")}</TableCell>
                        <TableCell className="max-w-xs truncate">{inq.question}</TableCell>
                        <TableCell>
                            <Badge variant={inq.status === 'Resolved' ? 'secondary' : 'outline'}>{inq.status}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{inq.response || 'No response yet.'}</TableCell>
                        </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">You have no inquiry history.</TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
