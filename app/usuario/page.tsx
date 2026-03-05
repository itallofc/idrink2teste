"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Redirect to profile page - this page is now deprecated
export default function UsuarioPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/perfil");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
