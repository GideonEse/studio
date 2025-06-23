'use client';
import Link from 'next/link';
import * as React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/mock-data';

export function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Please fill out all fields.',
      });
      return;
    }

    const newUser = {
      id: `usr_${users.length + 1}`,
      name: fullName,
      email: email,
      role: 'student' as const,
    };
    
    users.push(newUser);

    toast({
      title: 'Account Created!',
      description: 'Your new account has been registered. You can now log in.',
    });

    router.push('/');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Register</CardTitle>
        <CardDescription>
          Create an account to get started. New accounts are created as Students by default.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
         <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
            <Select defaultValue="student" disabled>
                <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button type="submit" className="w-full mt-4" onClick={handleRegister}>
          Create Account
        </Button>
      </CardContent>
      <CardFooter>
        <div className="text-sm">
          Already have an account?{' '}
          <Link href="/" className="underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
