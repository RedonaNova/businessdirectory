'use server';
import * as FaIcons from 'react-icons/fa';
import { BusinessProfileResponse } from '@businessdirectory/database';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
export default async function BusinessProfile({
  businessData,
}: {
  businessData: BusinessProfileResponse;
}) {
  return (
    <div className="p-2 xl:p-0 w-full mt-10 flex flex-col gap-5">
      <div className="text-2xl flex flex-wrap flex-row gap-5 items-baseline font-bold">
        <Link href={`/yellow-books?categoryId=${businessData.category.id}`}>
          <span className="text-muted text-sm">
            {businessData.category.parentCategory.name}
          </span>
        </Link>
        <FaIcons.FaChevronRight className="size-4" />
        <span className="text-muted text-sm">{businessData.name}</span>
      </div>
      <div className="flex mt-10 md:flex-row flex-col gap-10 items-start justify-between">
        <div className="flex-1">
          <div className="flex flex-row items-start gap-6">
            <Image
              src={businessData.photo}
              alt={businessData.name}
              width={100}
              height={100}
              className="rounded-xl border-2 size-28 object-cover border-border"
            />
            <div className="flex flex-col gap-2">
              <span>Баталгаажсан профайл</span>
              <h2 className="text-4xl  font-bold">{businessData.name}</h2>
              <span className="text-muted text-sm">{businessData.summary}</span>
              <div className="flex flex-row flex-wrap gap-6 items-center">
                <span>
                  Сэтгэгдэл {businessData.reviewStatistics.totalReviews}
                </span>
                <span className="text-muted text-sm">
                  {businessData.reviewStatistics.averageRating}
                </span>
              </div>
              <div className="flex flex-row gap-2 border-b border-border pb-10 items-center">
                <div className="border flex flex-row text-white bg-secondary gap-2 items-center justify-center border-border rounded-xl p-2">
                  <span className=" text-sm">Сэтгэгдэл бичих</span>
                </div>
                {businessData.link && (
                  <Link href={businessData.link} target="_blank">
                    <div className="border flex flex-row gap-2 items-center text-secondary bg-background justify-center border-border rounded-xl p-2">
                      <span className=" text-sm">Сайт руу зочлох</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            <h3 className="text-2xl font-bold">Байршил</h3>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm">
                  {businessData.addresses[0].address}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            <h3 className="text-2xl font-bold">Компанийн тухай</h3>
            {businessData.richContent && (
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: businessData.richContent }}
              />
            )}
          </div>
        </div>
        <SideRating businessData={businessData} />
      </div>
    </div>
  );
}

export async function SideRating({
  businessData,
}: {
  businessData: BusinessProfileResponse;
}) {
  return (
    <div className="border w-full max-w-xs border-border rounded-xl ">
      <div className="flex flex-row gap-4 border-b p-4 border-border w-full justify-between items-center">
        <div className="flex flex-col gap-3 items-center justify-center">
          <h1 className="text-5xl font-extrabold">
            {businessData.reviewStatistics.averageRating}
          </h1>
          {businessData.reviewStatistics.averageRating! > 0 && (
            <span>Маш сайн</span>
          )}
          <span className="text-muted text-sm">
            Cэтгэгдэл {businessData.reviewStatistics.totalReviews}
          </span>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {/* 5 stars */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium w-8">5 од</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${businessData.reviewStatistics.ratingPercentages.fiveStar}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 4 stars */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium w-8">4 од</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${businessData.reviewStatistics.ratingPercentages.fourStar}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 3 stars */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium w-8">3 од</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${businessData.reviewStatistics.ratingPercentages.threeStar}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 2 stars */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium w-8">2 од</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${businessData.reviewStatistics.ratingPercentages.twoStar}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 1 star */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium w-8">1 од</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${businessData.reviewStatistics.ratingPercentages.oneStar}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row gap-4 items-center">
          <span className="text-muted text-sm">Гомдол</span>
        </div>
      </div>
    </div>
  );
}
