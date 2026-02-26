import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const textSize = size === "large" ? "text-4xl" : "text-2xl";

  return (
    <Link href="/" className={`flex items-center gap-1 ${textSize} font-bold tracking-tight`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={size === "large" ? "h-10 w-10" : "h-7 w-7"}
        aria-hidden="true"
      >
        <path
          d="M8 6h16l-2 18a2 2 0 01-2 2H12a2 2 0 01-2-2L8 6z"
          stroke="#00f5ff"
          strokeWidth="2"
          fill="none"
        />
        <path d="M6 6h20" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M20 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
          stroke="#00f5ff"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse cx="16" cy="15" rx="4" ry="5" fill="rgba(0,245,255,0.1)" stroke="#00f5ff" strokeWidth="1" />
      </svg>
      <span className="text-[#00f5ff] neon-text">i</span>
      <span className="text-foreground">Drink</span>
    </Link>
  );
}
