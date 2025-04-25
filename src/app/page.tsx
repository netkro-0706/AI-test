"use client"

import { useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Movie, MovieResponse } from "@/types/movie"
import { getMovies } from "@/utils/api"
import ScrollToTop from "@/components/ScrollToTop"

// 메인 페이지 컴포넌트
export default function Home() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<MovieResponse>({
    queryKey: ["movies"],
    queryFn: ({ pageParam = 1 }) => getMovies(pageParam as number),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.data.movie_count / 16)
      const nextPage = lastPage.data.page_number + 1
      return nextPage <= totalPages ? nextPage : undefined
    },
    initialPageParam: 1,
  })

  const observer = useRef<IntersectionObserver>()
  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Movie List</h1>
      <div className="grid grid-cols-4 gap-6">
        {data?.pages.map((page, i) => (
          <div key={i} className="grid grid-cols-4 gap-6 col-span-4">
            {page.data.movies.map((movie: Movie, index: number) => (
              <div
                key={movie.id}
                ref={
                  index === page.data.movies.length - 1
                    ? lastMovieElementRef
                    : null
                }
                className="col-span-1"
              >
                <Link href={`/movie/${movie.id}`}>
                  <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative aspect-[2/3] w-full">
                      <Image
                        src={movie.medium_cover_image}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover"
                        priority={index < 16}
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                        {movie.title}
                      </h2>
                      <div className="flex justify-between text-sm text-gray-700 mt-auto">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {movie.rating}
                        </span>
                        <span>{movie.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <ScrollToTop />
    </main>
  )
}
