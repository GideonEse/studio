'use client';
import Link from 'next/link';

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
import { Briefcase, Stethoscope, User } from 'lucide-react';

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your matric number below to login. For demo purposes, select a role to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="matricNumber">Matric Number</Label>
          <Input id="matricNumber" type="text" placeholder="S012345" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-4">
            <Button asChild className="col-span-2">
                <Link href="/student/dashboard"><User/>Sign in as Student</Link>
            </Button>
            <Button asChild variant="secondary" className="col-span-2">
                <Link href="/admin/dashboard"><Stethoscope/>Sign in as Doctor</Link>
            </Button>
            <Button asChild variant="outline" className="col-span-2">
                <Link href="/admin/dashboard"><Briefcase/>Sign in as Staff</Link>
            </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
