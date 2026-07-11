import Link from "next/link";

export default function Navbar({ data }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between gap-2 px-3 py-2">
        <Link href="/" className="shrink-0 text-sm font-semibold text-black">
          {data.logoText}
        </Link>
        <ul className="hidden flex-wrap gap-2 md:flex">
          {data.links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="text-xs text-black">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {data.cta && (
          <Link
            href={data.cta.href}
            className="shrink-0 bg-blue-700 px-2 py-1 text-xs font-semibold text-white"
          >
            {data.cta.label}
          </Link>
        )}
      </nav>
    </header>
  );
}
