import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/icons/logo";

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
       <div className="flex items-center gap-4 mb-8 text-primary">
        <Logo className="w-12 h-12" />
        <h1 className="text-2xl md:text-4xl text-center font-bold font-headline text-foreground">
          Crawford University Health Monitoring System
        </h1>
      </div>
      <RegisterForm />
    </main>
  );
}
