"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; message: string }> = {
    could_not_verify_email: {
      title: "Nao foi possivel verificar seu email",
      message: "O link de verificacao pode ter expirado ou ja foi usado. Tente fazer login ou solicitar um novo link.",
    },
    access_denied: {
      title: "Acesso negado",
      message: "Voce nao tem permissao para acessar esta pagina.",
    },
    default: {
      title: "Erro de autenticacao",
      message: "Ocorreu um erro durante a autenticacao. Por favor, tente novamente.",
    },
  };

  const { title, message } = errorMessages[error || "default"] || errorMessages.default;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="glass rounded-2xl p-8">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-muted-foreground">{message}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/perfil"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 rounded-xl border border-border/50 px-6 py-3 font-medium text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-[#ea1d2c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
