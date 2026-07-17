import Link from "next/link";

const logoText = "JAGUAR ENGINES GUIDE";
const links = [
  { label: "XE", href: "#" },
  { label: "XF", href: "#" },
  { label: "XJ", href: "#" },
  { label: "F-PACE", href: "#" },
  { label: "E-PACE", href: "#" },
  { label: "F-TYPE", href: "#" },
  { label: "GUIDES", href: "#" },
  { label: "ABOUT", href: "#" },
];
const cta = { label: "START YOUR RESEARCH", href: "#" };

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between gap-2 px-3 py-2">
        <Link href="/" className="shrink-0 text-sm font-semibold text-black">
          {logoText}
        </Link>
        <ul className="hidden flex-wrap gap-2 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="text-xs text-black">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={cta.href}
          className="shrink-0 bg-blue-700 px-2 py-1 text-xs font-semibold text-white"
        >
          {cta.label}
        </Link>
      </nav>
    </header>
  );
}
