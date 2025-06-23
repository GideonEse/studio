import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/icons/logo";

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
       <div className="flex items-center gap-4 mb-8 text-primary">
        <Logo className="w-12 h-12" />
        <h1 className="text-4xl font-bold font-headline text-foreground">
          CampusCare Connect
        </h1>
      </div>
      <RegisterForm />
    </main>
  );
}