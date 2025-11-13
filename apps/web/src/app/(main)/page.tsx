import CategoryRecommendation from '../_components/category-recommendation';
import FirstSearch from '../_components/first-search';
import NewComments from '../_components/new-comments';
import TryOurBusiness from '../_components/try-our-business';
import BestInCategories from '../_components/best-in-categories';
import { Suspense } from 'react';

// Force dynamic rendering since we depend on backend API
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="">
      <FirstSearch />
      <div className="flex justify-center  items-center mb-10 flex-col w-full">
        <div className="w-full max-w-7xl space-y-10  mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryRecommendation />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <TryOurBusiness />
          </Suspense>

          <Suspense fallback={<div>Loading...</div>}>
            <BestInCategories />
          </Suspense>

          <Suspense fallback={<div>Loading...</div>}>
            <NewComments />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
