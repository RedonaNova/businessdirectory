import BusinessProfile from './_components/business-profile';
import BusinessReviews from './_components/business-reviews';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return [];
    }

    const response = await fetch(`${baseUrl}/businesses?limit=50`, {
      // Add timeout and error handling for build time
      next: { revalidate: 3600 }, // Cache for 1 hour during build
    });

    if (!response.ok) {
      console.warn(
        'Failed to fetch businesses for static params, falling back to dynamic rendering'
      );
      return [];
    }

    const data = await response.json();
    const businesses = data?.data || [];

    return businesses.map((business: { id: number }) => ({
      id: String(business.id),
    }));
  } catch (error) {
    // Pages will be generated dynamically at request time
    console.warn(
      'Error generating static params, falling back to dynamic rendering:',
      error
    );
    return [];
  }
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
