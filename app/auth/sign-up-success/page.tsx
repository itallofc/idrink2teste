import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <Logo size="large" />

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <Mail className="h-10 w-10 text-green-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Verifique seu email
          </h1>
          <p className="text-muted-foreground">
            Enviamos um link de confirmacao para seu email. 
            Clique no link para ativar sua conta e comecar a usar o iDrink.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-[#ea1d2c] hover:bg-[#c9171f]">
            <Link href="/auth/login">
              Ir para login
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/home">
              Voltar para o inicio
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="text-sm text-muted-foreground">
          Nao recebeu o email? Verifique sua pasta de spam ou{" "}
          <Link href="/auth/sign-up" className="text-[#ea1d2c] hover:underline">
            tente novamente
          </Link>
        </p>
      </div>
    </div>
  );
}
