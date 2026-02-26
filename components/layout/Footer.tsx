import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center md:flex-row md:justify-between md:text-left lg:px-8">
        <Logo />
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} iDrink. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span className="cursor-pointer transition-colors hover:text-foreground">Termos</span>
          <span className="cursor-pointer transition-colors hover:text-foreground">Privacidade</span>
          <span className="cursor-pointer transition-colors hover:text-foreground">Suporte</span>
        </div>
      </div>
    </footer>
  );
}
