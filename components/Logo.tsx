import Link from "next/link";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="ppGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eead4" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#0d111c" stroke="url(#ppGrad)" strokeWidth="2.5" />
      {/* peptide chain / molecule */}
      <g stroke="url(#ppGrad)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M13 30 L20 20 L28 28 L35 18" />
      </g>
      <g fill="#5eead4">
        <circle cx="13" cy="30" r="3.4" />
        <circle cx="20" cy="20" r="3.4" />
        <circle cx="28" cy="28" r="3.4" />
        <circle cx="35" cy="18" r="3.4" />
      </g>
      <circle cx="20" cy="20" r="6.2" fill="none" stroke="url(#ppGrad)" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold tracking-wide text-white">
      <LogoMark size={size} />
      <span className="text-lg leading-none">
        PLATIN<span className="text-accent-400">PEPTIDES</span>
      </span>
    </Link>
  );
}
