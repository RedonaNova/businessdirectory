import Link from 'next/link';
import { auth } from '../auth';
import UserMenu from './UserMenu';

export default async function Nav() {
  const session = await auth();

  return (
    <div className="flex items-center gap-8">
      <Link
        href={`/yellow-books/categories`}
        className="hover:text-primary duration-300 text-xl font-bold"
      >
        Төрөл
      </Link>
      {session?.user ? (
        <UserMenu name={session.user.name || session.user.email} role={session.user.role} />
      ) : (
        <Link
          href={`/signin`}
          className="hover:text-primary duration-300 text-xl font-bold"
        >
          Нэвтрэх
        </Link>
      )}
      <Link
        href={`/forbusinesses`}
        className="bg-primary  text-black px-4 py-2 rounded-xl text-xl font-bold"
      >
        Бизнесүүдэд
      </Link>
    </div>
  );
}
