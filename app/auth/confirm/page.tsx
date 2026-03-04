"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    if (error) {
      setStatus("error");
      setMessage(errorDescription || "Ocorreu um erro na confirmacao do email.");
    } else {
      setStatus("success");
      setMessage("Seu email foi confirmado com sucesso!");
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/perfil");
      }, 3000);
    }
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="glass rounded-2xl p-8">
        {status === "success" ? (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Email Confirmado!</h1>
            <p className="mt-3 text-muted-foreground">{message}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Voce sera redirecionado automaticamente...
            </p>
            <Link
              href="/perfil"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Fazer Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Erro na Confirmacao</h1>
            <p className="mt-3 text-muted-foreground">{message}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/perfil"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Tentar Login
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/50 px-6 py-3 font-medium text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-foreground"
              >
                Criar nova conta
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
