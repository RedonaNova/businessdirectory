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
    // During build time, the backend might not be available
    // Return empty array to allow build to succeed, pages will be generated dynamically
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return [];
    }

    const response = await fetch(`${baseUrl}/businesses?limit=50`, {
      next: { revalidate: 3600 }, // Cache for 1 hour during build
    });

    if (!response.ok) {
      console.warn('Failed to fetch businesses for static params, falling back to dynamic rendering');
      return [];
    }

    const data = await response.json();
    const businesses = data?.data || [];

    return businesses.map((business: { id: number }) => ({
      id: String(business.id),
    }));
  } catch (error) {
    // If fetch fails (e.g., backend not available during build), return empty array
    // Pages will be generated dynamically at request time
    console.warn('Error generating static params, falling back to dynamic rendering:', error);
    return [];
  }
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let businessData;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      notFound();
    }

    const response = await fetch(`${baseUrl}/businesses/${id}`, {
      next: {
        revalidate: false, // SSG: no time-based revalidation
        tags: [`business-${id}`], // On-demand revalidation via tag
      },
    });

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    businessData = data?.data;

    if (!businessData) {
      notFound();
    }
  } catch (error) {
    // If fetch fails during build, show 404
    console.error('Error fetching business data:', error);
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
