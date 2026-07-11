import Link from "next/link";

export default function Footer({ data }) {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-8xl items-center justify-between px-3 py-2">
        <p className="text-xs text-gray-600">{data.text}</p>
        <ul className="flex gap-3">
          {data.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-xs text-gray-600">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
