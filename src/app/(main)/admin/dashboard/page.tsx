'use client';

import * as React from "react";
import { type User } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Link from "next/link";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const chartData = [
    { month: "January", appointments: 186 },
    { month: "February", appointments: 305 },
    { month: "March", appointments: 237 },
    { month: "April", appointments: 273 },
    { month: "May", appointments: 209 },
    { month: "June", appointments: 214 },
  ]
  
  const chartConfig = {
    appointments: {
      label: "Appointments",
      color: "hsl(var(--primary))",
    },
  }

export default function DoctorDashboard() {
  const { users, appointments, inquiries, deleteUser } = useAuth();
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  const todaysAppointments = appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString());
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending');

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    setUserToDelete(null);
  }

  return (
    <>
      <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                          <TableCell>{format(new Date(apt.dateTime), "p")}</TableCell>
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
                          <TableCell>{format(new Date(inq.date), "PPP")}</TableCell>
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

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Appointment Analytics</CardTitle>
            <CardDescription>Monthly appointment volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="appointments" fill="var(--color-appointments)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">User Management</CardTitle>
            <CardDescription>Manage all users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Matric Number</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.matricNumber}</TableCell>
                    <TableCell>
                      <Badge variant={
                          user.role === 'doctor' ? 'secondary' : 
                          user.role === 'staff' ? 'default' : 'outline'
                        }>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onSelect={() => setUserToDelete(user)}>
                            <Trash2 className="mr-2 h-4 w-4"/>Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user
                    from the list for this session.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleDeleteUser} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
