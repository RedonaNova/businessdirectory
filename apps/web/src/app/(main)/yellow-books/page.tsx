import YellowBooksList from './_components/yellow-books-list';
import { Suspense } from 'react';
import { YellowBooksListSkeleton } from './_components/skeletons';

// ISR: Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function YellowBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId: string; parentCategoryId: string }>;
}) {
  const { categoryId, parentCategoryId } = await searchParams;
  return (
    <div className="">
      <div className="flex mb-10 justify-center items-center flex-col w-full">
        <div className="w-full max-w-7xl space-y-10 mx-auto">
          <Suspense fallback={<YellowBooksListSkeleton />}>
            <YellowBooksList
              categoryId={categoryId}
              parentCategoryId={parentCategoryId}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
