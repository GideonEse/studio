'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarPlus, MessageSquareQuote } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth-context";

export default function StudentDashboard() {
  const { currentUser, appointments, inquiries } = useAuth();

  if (!currentUser) return null;

  const upcomingAppointments = appointments.filter(a => a.studentId === currentUser.id && a.status === 'Confirmed' && new Date(a.dateTime) >= new Date());
  const inquiryHistory = inquiries.filter(i => i.studentId === currentUser.id);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><CalendarPlus/> Book an Appointment</CardTitle>
                <CardDescription>Need to see a doctor? Schedule your visit here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild>
                    <Link href="/book-appointment">Book Now <ArrowRight className="ml-2"/></Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><MessageSquareQuote/> Ask a Question</CardTitle>
                <CardDescription>Have a non-urgent health question? Ask our staff.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild>
                    <Link href="/inquiries">Submit Inquiry <ArrowRight className="ml-2"/></Link>
                </Button>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.length > 0 ? upcomingAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>{format(new Date(apt.dateTime), "PPP p")}</TableCell>
                  <TableCell>{apt.reason}</TableCell>
                  <TableCell><Badge variant="default">{apt.status}</Badge></TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No upcoming appointments.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Inquiry History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiryHistory.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell>{format(new Date(inq.date), "PPP")}</TableCell>
                  <TableCell className="max-w-xs truncate">{inq.question}</TableCell>
                  <TableCell>
                    <Badge variant={inq.status === 'Resolved' ? 'secondary' : 'outline'}>{inq.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
