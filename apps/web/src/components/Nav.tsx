import Link from 'next/link';

export default function Nav() {
  return (
    <div className="flex items-center gap-8">
      <Link
        href={`/yellow-books/categories`}
        className="hover:text-primary duration-300 text-xl font-bold"
      >
        Төрөл
      </Link>
      <Link
        href={`/login`}
        className="hover:text-primary duration-300 text-xl font-bold"
      >
        Нэвтрэх
      </Link>
      <Link
        href={`/forbusinesses`}
        className="bg-primary  text-black px-4 py-2 rounded-xl text-xl font-bold"
      >
        Бизнесүүдэд
      </Link>
    </div>
  );
}
