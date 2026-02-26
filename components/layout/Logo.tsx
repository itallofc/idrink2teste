import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize = size === "large" ? "text-4xl" : "text-2xl";

  return (
    <Link href="/home" className={`flex items-center gap-1.5 ${textSize} font-bold tracking-tight`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={size === "large" ? "h-10 w-10" : "h-7 w-7"}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ea1d2c" />
          </linearGradient>
        </defs>
        <path
          d="M8 6h16l-2 18a2 2 0 01-2 2H12a2 2 0 01-2-2L8 6z"
          stroke="#ea1d2c"
          strokeWidth="2"
          fill="none"
        />
        <path d="M6 6h20" stroke="#ea1d2c" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M10 10l2 12c0 1 1.5 2 4 2s4-1 4-2l2-12"
          fill="url(#logo-gradient)"
        />
        <ellipse cx="16" cy="11" rx="5" ry="2" fill="#fff" opacity="0.9" />
      </svg>
      <span className="text-foreground">I</span>
      <span className="bg-gradient-to-r from-[#ea1d2c] to-[#ff6b6b] bg-clip-text text-transparent">drink</span>
    </Link>
  );
}
