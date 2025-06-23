import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StaffDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl font-bold">This page is no longer in use.</h1>
      <p className="text-muted-foreground">
        Staff and Admin roles have been consolidated into the Doctor role.
      </p>
      <Button asChild className="mt-4">
          <Link href="/admin/dashboard">Go to Doctor Dashboard</Link>
      </Button>
    </div>
  );
}
