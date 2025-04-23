import Link from "next/link"
import Image from "next/image"
import { Movie } from "@/types/movie"

// YTS API에서 특정 영화의 상세 정보를 가져오는 함수
// id: 영화 ID
async function getMovie(id: string) {
  const res = await fetch(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`,
    {
      next: { revalidate: 3600 }, // 1시간마다 데이터 재검증
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch movie")
  }
  return res.json()
}

// 영화 상세 페이지 컴포넌트
// params: URL 파라미터 (영화 ID 포함)
export default async function MoviePage({
  params,
}: {
  params: { id: string }
}) {
  // API에서 영화 상세 데이터 가져오기
  const data = await getMovie(params?.id || "")
  // 영화 정보
  const movie = data.data.movie as Movie

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Movies
      </Link>

      <div className="bg-blue-50 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={movie.large_cover_image}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {movie.title}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-700">Rating: {movie.rating}</span>
              </div>
              <div className="text-gray-700">Year: {movie.year}</div>
              <div className="text-gray-700">
                Runtime: {movie.runtime} minutes
              </div>
              {movie.language && (
                <div className="text-gray-700">
                  Language: {movie.language.toUpperCase()}
                </div>
              )}
              {movie.mpa_rating && (
                <div className="text-gray-700">
                  MPA Rating: {movie.mpa_rating}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Genres
              </h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres &&
                  movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
              </div>
            </div>

            {movie.description_full && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Synopsis
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {movie.description_full}
                </p>
              </div>
            )}

            {movie.yt_trailer_code && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Trailer
                </h2>
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Download Options
              </h2>
              <div className="grid gap-4">
                {movie.torrents.map((torrent) => (
                  <a
                    key={torrent.hash}
                    href={torrent.url}
                    className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {torrent.quality}
                      </div>
                      <div className="text-sm text-gray-600">
                        {torrent.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Size: {torrent.size}
                      </div>
                      <div className="text-sm text-gray-600">
                        Seeds: {torrent.seeds} | Peers: {torrent.peers}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
