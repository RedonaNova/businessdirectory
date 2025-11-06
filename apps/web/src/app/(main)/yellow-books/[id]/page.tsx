import BusinessProfile from './_components/business-profile';
import BusinessReviews from './_components/business-reviews';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  BusinessProfileSkeleton,
  BusinessReviewsSkeleton,
} from '../_components/skeletons';

// SSG: Generate static pages at build time, revalidate on-demand via tags
export const revalidate = 60; // Enable time-based revalidation, also use on-demand
export const dynamicParams = false; // Allow all dynamic params in generateStaticParams

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/businesses?limit=50`,
      { next: { revalidate: 0 } } // Revalidate business list every hour
    );
    const businesses = (await response.json()).data;

    return businesses.map((business: { id: number }) => ({
      id: String(business.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
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
    {
      next: {
        revalidate: false, // SSG: no time-based revalidation
        tags: [`business-${id}`], // On-demand revalidation via tag
      },
    }
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
        {/* Profile - streamed separately */}
        <Suspense fallback={<BusinessProfileSkeleton />}>
          <BusinessProfile businessData={businessData} />
        </Suspense>
        {/* Reviews - streamed separately with ISR */}
        <Suspense fallback={<BusinessReviewsSkeleton />}>
          <BusinessReviews id={Number(id)} />
        </Suspense>
      </div>
    </div>
  );
}
