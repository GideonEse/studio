'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay } from 'date-fns';
import { appointments } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM',
];

export default function BookAppointmentPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const { toast } = useToast();
  const router = useRouter();

  const bookedTimes = React.useMemo(() => {
    if (!date) return [];
    // Get all appointments for the selected day
    return appointments
      .filter(apt => apt.status === 'Confirmed' && startOfDay(apt.dateTime).getTime() === startOfDay(date).getTime())
      .map(apt => format(apt.dateTime, 'hh:mm a'));
  }, [date]);

  const handleBooking = () => {
    if (!date || !selectedTime) {
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "Please select a date and time slot.",
        })
        return;
    }

    const [hours, minutesPart] = selectedTime.split(':');
    const [minutes, modifier] = minutesPart.split(' ');
    let hourNumber = parseInt(hours, 10);

    if (modifier === 'PM' && hourNumber < 12) {
      hourNumber += 12;
    }
    if (modifier === 'AM' && hourNumber === 12) {
      hourNumber = 0;
    }
    
    const bookingDateTime = new Date(date);
    bookingDateTime.setHours(hourNumber, parseInt(minutes, 10), 0, 0);

    const newAppointment = {
        id: `apt_${Date.now()}`,
        studentName: 'Alice Johnson',
        studentId: 'usr_1',
        dateTime: bookingDateTime,
        reason: reason || 'Not provided',
        status: 'Confirmed' as const,
    };

    appointments.push(newAppointment);

    toast({
        title: "Appointment Booked!",
        description: `Your appointment is confirmed for ${format(date, "PPP")} at ${selectedTime}.`,
    });

    router.push('/student/dashboard');
  };

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6 font-headline">Book an Appointment</h1>
        <Card>
            <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">1. Select a Date</h2>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">2. Select a Time</h2>
                        <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => {
                            const isBooked = bookedTimes.includes(time);
                            return (
                                <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                onClick={() => setSelectedTime(time)}
                                disabled={isBooked}
                                >
                                {time}
                                </Button>
                            )
                        })}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">3. Reason for Visit</h2>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="reason">Please provide a brief reason (optional, 200 characters max)</Label>
                            <Textarea 
                                placeholder="E.g. General check-up, flu symptoms..." 
                                id="reason" 
                                maxLength={200}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleBooking} size="lg" className="w-full">
                        Confirm Booking
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
