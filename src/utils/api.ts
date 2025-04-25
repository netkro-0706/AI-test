import { MovieResponse } from "@/types/movie"

const BASE_URL = "https://yts.mx/api/v2"

export async function getMovies(
  page: number = 1,
  limit: number = 16
): Promise<MovieResponse> {
  const response = await fetch(
    `${BASE_URL}/list_movies.json?page=${page}&limit=${limit}`,
    {
      next: { revalidate: 3600 }, // 1시간마다 캐시 갱신
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch movies")
  }

  return response.json()
}

export async function getMovieDetails(movieId: number) {
  const response = await fetch(
    `${BASE_URL}/movie_details.json?movie_id=${movieId}`,
    {
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch movie details")
  }

  return response.json()
}
