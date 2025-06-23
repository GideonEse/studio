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
import { Building, ShieldCheck, User } from 'lucide-react';

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account. For demo purposes, select a role to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required disabled />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required disabled />
        </div>
        <div className="grid gap-2 pt-4">
            <Button asChild>
                <Link href="/student/dashboard"><User/>Sign in as Student</Link>
            </Button>
            <Button asChild variant="secondary">
                <Link href="/staff/dashboard"><Building/>Sign in as Staff</Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin/dashboard"><ShieldCheck/>Sign in as Admin</Link>
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
