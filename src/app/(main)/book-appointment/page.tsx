'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Input } from '@/components/ui/input';

export default function BookAppointmentPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState('');
  const [reason, setReason] = React.useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser, addAppointment } = useAuth();

  const handleBooking = () => {
    if (!date || !time || !currentUser) {
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "Please select a date and time for your request.",
        })
        return;
    }

    const [hourNumber, minuteNumber] = time.split(':').map(Number);
    
    const bookingDateTime = new Date(date);
    bookingDateTime.setHours(hourNumber, minuteNumber, 0, 0);

    const newAppointment = {
        id: `apt_${Date.now()}`,
        studentName: currentUser.name,
        studentId: currentUser.id,
        dateTime: bookingDateTime,
        reason: reason || 'Not provided',
        status: 'Pending' as const,
    };

    addAppointment(newAppointment);

    toast({
        title: "Appointment Requested",
        description: `Your request for ${format(bookingDateTime, "PPP p")} has been sent. You will be notified once it's confirmed.`,
    });

    router.push('/student/dashboard');
  };

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6 font-headline">Request an Appointment</h1>
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
                        <h2 className="text-xl font-semibold mb-4">2. Suggest a Time</h2>
                        <Input 
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
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
                        Submit Request
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
