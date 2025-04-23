import Link from "next/link"
import Image from "next/image"
import { Movie } from "@/types/movie"

// YTS API에서 영화 목록을 가져오는 함수
// page: 현재 페이지 번호 (기본값: 1)
async function getMovies(page: number = 1) {
  const res = await fetch(
    `https://yts.mx/api/v2/list_movies.json?limit=20&page=${page}`,
    {
      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch movies")
  }
  return res.json()
}

// 페이지네이션 버튼 컴포넌트
// page: 표시할 페이지 번호
// currentPage: 현재 선택된 페이지 번호
// totalPages: 전체 페이지 수
function PaginationButton({
  page,
  currentPage,
  totalPages,
}: {
  page: number
  currentPage: number
  totalPages: number
}) {
  if (page < 1 || page > totalPages) return null

  return (
    <Link
      href={`/?page=${page}`}
      className={`px-4 py-2 rounded ${
        page === currentPage
          ? "bg-blue-600 text-white"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {page}
    </Link>
  )
}

// 메인 페이지 컴포넌트
// searchParams: URL 쿼리 파라미터 (페이지 번호 포함)
export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  // 현재 페이지 번호 (기본값: 1)
  const currentPage = Number(searchParams?.page) || 1
  // API에서 영화 데이터 가져오기
  const data = await getMovies(currentPage)
  // 영화 목록
  const movies = data.data.movies as Movie[]
  // 전체 페이지 수 계산 (한 페이지당 20개 영화)
  const totalPages = Math.ceil(data.data.movie_count / 20)

  // 페이지 범위 계산
  const range = 2 // 현재 페이지 기준 좌우로 표시할 페이지 수
  const startPage = Math.max(1, currentPage - range)
  const endPage = Math.min(totalPages, currentPage + range)

  // 표시할 페이지 번호 배열 생성
  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Movie List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={movie.medium_cover_image}
                  alt={movie.title}
                  fill
                  className="object-cover"
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
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center space-x-2">
        <Link
          href={`/?page=1`}
          className={`px-4 py-2 rounded ${
            currentPage <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {"<<"}
        </Link>
        <Link
          href={`/?page=${Math.max(1, currentPage - 1)}`}
          className={`px-4 py-2 rounded ${
            currentPage <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {"<"}
        </Link>
        {pages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        ))}
        <Link
          href={`/?page=${Math.min(totalPages, currentPage + 1)}`}
          className={`px-4 py-2 rounded ${
            currentPage >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {">"}
        </Link>
        <Link
          href={`/?page=${totalPages}`}
          className={`px-4 py-2 rounded ${
            currentPage >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {">>"}
        </Link>
      </div>
    </main>
  )
}
