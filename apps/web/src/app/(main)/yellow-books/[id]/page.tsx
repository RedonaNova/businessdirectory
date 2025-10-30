import BusinessProfile from './_components/business-profile';
import BusinessReviews from './_components/business-reviews';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/businesses?limit=50`
  );
  const businesses = (await response.json()).data;

  return businesses.map((business: { id: number }) => ({
    id: String(business.id),
  }));
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/${id}`,
    { next: { revalidate: 60, tags: [`business-${id}`] } }
  );

  if (!response.ok) {
    notFound();
  }

  const businessData = (await response.json()).data;

  if (!businessData) {
    notFound();
  }

  return (
    <div className="flex mb-10 justify-center items-center flex-col w-full">
      <div className="w-full max-w-7xl space-y-10 mx-auto">
        <Suspense fallback={<div>Loading profile...</div>}>
          <BusinessProfile businessData={businessData} />
        </Suspense>
        <Suspense fallback={<div>Loading reviews...</div>}>
          <BusinessReviews id={Number(id)} />
        </Suspense>
      </div>
    </div>
  );
}
