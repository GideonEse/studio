'use client';

import * as React from "react";
import { type User, type Appointment } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Link from "next/link";
import { format, subMonths } from "date-fns";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
  
  const chartConfig = {
    appointments: {
      label: "Appointments",
      color: "hsl(var(--primary))",
    },
  }

export default function DoctorDashboard() {
  const { users, appointments, inquiries, deleteUser, updateAppointment } = useAuth();
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [appointmentToManage, setAppointmentToManage] = React.useState<Appointment | null>(null);

  // State for the edit form
  const [editedDate, setEditedDate] = React.useState<Date | undefined>();
  const [editedTime, setEditedTime] = React.useState('');
  const [editedStatus, setEditedStatus] = React.useState<Appointment['status']>('Pending');
  const [doctorMessage, setDoctorMessage] = React.useState('');

  React.useEffect(() => {
    if (appointmentToManage) {
        setEditedDate(new Date(appointmentToManage.dateTime));
        setEditedTime(format(new Date(appointmentToManage.dateTime), 'HH:mm'));
        setEditedStatus(appointmentToManage.status);
        setDoctorMessage(appointmentToManage.doctorMessage || '');
    }
  }, [appointmentToManage]);

  const chartData = React.useMemo(() => {
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), i);
      return {
        key: format(d, 'yyyy-MM'), 
        month: format(d, 'MMMM'),
        appointments: 0,
      };
    }).reverse();

    const monthMap = new Map(lastSixMonths.map(m => [m.key, m]));
    
    appointments.forEach(apt => {
        if (apt.status === 'Confirmed' || apt.status === 'Completed') {
            const aptKey = format(new Date(apt.dateTime), 'yyyy-MM');
            if (monthMap.has(aptKey)) {
                monthMap.get(aptKey)!.appointments++;
            }
        }
    });

    return Array.from(monthMap.values()).map(({ month, appointments }) => ({
      month,
      appointments,
    }));
  }, [appointments]);

  const activeAppointments = appointments
    .filter(a => a.status !== 'Completed' && a.status !== 'Cancelled')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const pendingInquiries = inquiries.filter(i => i.status === 'Pending');

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id);
    setUserToDelete(null);
  }

  const handleSaveAppointment = () => {
    if (!appointmentToManage || !editedDate || !editedTime) return;

    const [hour, minute] = editedTime.split(':').map(Number);
    const newDateTime = new Date(editedDate);
    newDateTime.setHours(hour, minute, 0, 0);

    const updatedAppointment: Appointment = {
        ...appointmentToManage,
        dateTime: newDateTime,
        status: editedStatus,
        doctorMessage: doctorMessage
    };

    updateAppointment(updatedAppointment);
    setAppointmentToManage(null);
  }

  return (
    <>
      <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
              <Card>
                  <CardHeader>
                  <CardTitle className="font-headline">Manage Appointments</CardTitle>
                  <CardDescription>Review pending requests and manage confirmed appointments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <Table>
                      <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Requested Date & Time</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {activeAppointments.length > 0 ? activeAppointments.map((apt) => (
                          <TableRow key={apt.id}>
                            <TableCell>{apt.studentName}</TableCell>
                            <TableCell>{format(new Date(apt.dateTime), "PPP p")}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{apt.reason}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    apt.status === 'Pending' ? 'outline' :
                                    apt.status === 'Confirmed' ? 'default' : 'secondary'
                                }>{apt.status}</Badge>
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
                                    <DropdownMenuItem onSelect={() => setAppointmentToManage(apt)}>
                                        <Pencil className="mr-2 h-4 w-4" />Manage
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                          <TableCell colSpan={5} className="text-center">No active appointments.</TableCell>
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
            <CardDescription>Monthly volume of confirmed/completed appointments.</CardDescription>
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
                  <TableHead>Staff No.</TableHead>
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

      <Dialog open={!!appointmentToManage} onOpenChange={(open) => !open && setAppointmentToManage(null)}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Manage Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label>Student</Label>
                    <Input disabled value={appointmentToManage?.studentName} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="date">Appointment Date</Label>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className="justify-start text-left font-normal"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editedDate ? format(editedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={editedDate}
                        onSelect={setEditedDate}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="time">Appointment Time</Label>
                    <Input 
                        id="time" 
                        type="time" 
                        value={editedTime}
                        onChange={(e) => setEditedTime(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={editedStatus} onValueChange={(value) => setEditedStatus(value as Appointment['status'])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="message">Message for Student (Optional)</Label>
                    <Textarea 
                        id="message"
                        placeholder="e.g., 'Please come 10 minutes early.'"
                        value={doctorMessage}
                        onChange={(e) => setDoctorMessage(e.target.value)}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setAppointmentToManage(null)}>Cancel</Button>
                <Button onClick={handleSaveAppointment}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
