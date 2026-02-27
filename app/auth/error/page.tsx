import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <Logo size="large" />

        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Erro de autenticacao
          </h1>
          <p className="text-muted-foreground">
            Ocorreu um erro durante o processo de autenticacao. 
            Por favor, tente novamente ou entre em contato com o suporte.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-[#ea1d2c] hover:bg-[#c9171f]">
            <Link href="/auth/login">
              Tentar novamente
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/home">
              Voltar para o inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
