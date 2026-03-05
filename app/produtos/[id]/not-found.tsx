import Link from "next/link";
import { PackageX, ArrowLeft, Home } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <PackageX className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Produto não encontrado
      </h1>
      
      <p className="mb-8 max-w-md text-muted-foreground">
        O produto que você está procurando não existe ou foi removido.
        Pode ser que o link esteja incorreto ou o produto não esteja mais disponível.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/home"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          <Home className="h-5 w-5" />
          Ir para a Home
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>
      </div>
    </div>
  );
}
