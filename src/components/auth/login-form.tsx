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
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

export function LoginForm() {
  const [matricNumber, setMatricNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(matricNumber, password);
      if (user) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
        if (user.role === 'student') {
          router.push('/student/dashboard');
        } else if (user.role === 'staff') {
            router.push('/staff/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid matric/staff number or password.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not process your login request.',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your matric/staff number and password to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="matricNumber">Matric / Staff Number</Label>
            <Input 
              id="matricNumber" 
              type="text" 
              placeholder="S012345 / D10001" 
              required 
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading && <Loader className="animate-spin mr-2" />}
            Login
          </Button>
        </CardContent>
        <CardFooter>
          <div className="text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
