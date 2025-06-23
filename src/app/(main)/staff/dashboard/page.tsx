import { appointments, inquiries } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function StaffDashboard() {
  const todaysAppointments = appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString());
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending');

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Today's Appointments</CardTitle>
          <CardDescription>A list of all confirmed appointments for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysAppointments.length > 0 ? todaysAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>{format(apt.dateTime, "p")}</TableCell>
                  <TableCell>{apt.studentName}</TableCell>
                  <TableCell>{apt.reason}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No appointments scheduled for today.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pending Health Inquiries</CardTitle>
          <CardDescription>Student questions that need a response.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell>{format(inq.date, "PPP")}</TableCell>
                  <TableCell>{inq.studentName}</TableCell>
                  <TableCell className="max-w-sm truncate">{inq.question}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm">
                      <Link href={`/inquiries/${inq.id}`}>View & Reply</Link>
                    </Button>
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
