export interface Movie {
  id: number
  title: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
  vote_average?: number
  genre_ids?: number[]
  popularity?: number
}

export interface MovieGenre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  runtime?: number | null
  tagline?: string
  genres?: MovieGenre[]
  original_language?: string
}

export interface MoviePage {
  movies: Movie[]
  page: number
  totalPages: number
  totalResults: number
}

export interface TmdbMoviePageResponse {
  results?: unknown
  page?: number
  total_pages?: number
  total_results?: number
  status_message?: string
}
