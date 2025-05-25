import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">YourWebsite</div>
      <ul className="flex gap-6">
        <li>
          <Link href="/" className="hover:text-gray-400 transition">
            Home
          </Link>
        </li>
        <li>
          <Link href="/movies" className="hover:text-gray-400 transition">
            Movies
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-400 transition">
            About Us
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-gray-400 transition">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
