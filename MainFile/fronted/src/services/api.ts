import type { Movie, MovieDetails, MoviePage, TmdbMoviePageResponse } from "../types/movie"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export type TmdbParamValue = string | number | boolean | null | undefined
export type TmdbParams = Record<string, TmdbParamValue>

const createTmdbUrl = (endpoint: string, params: TmdbParams = {}): URL => {
    if (!API_KEY) {
        throw new Error("Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.")
    }

    const url = new URL(`${BASE_URL}${endpoint}`)
    url.searchParams.set("api_key", API_KEY)

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value))
        }
    })

    return url
}

const requestTmdb = async <TResponse>(endpoint: string, params?: TmdbParams): Promise<TResponse> => {
    const url = createTmdbUrl(endpoint, params)

    let response: Response

    try {
        response = await fetch(url)
    } catch {
        throw new Error("Unable to reach TMDB. Check your connection and try again.")
    }

    let data: TResponse & { status_message?: string }

    try {
        data = await response.json()
    } catch {
        throw new Error("TMDB returned an unreadable response.")
    }

    if (!response.ok) {
        throw new Error(data.status_message || `TMDB request failed with status ${response.status}.`)
    }

    return data
}

const requestMovies = async (endpoint: string, params?: TmdbParams): Promise<Movie[]> => {
    const data = await requestTmdb<TmdbMoviePageResponse>(endpoint, params)

    if (!Array.isArray(data.results)) {
        throw new Error("TMDB response did not include a movie list.")
    }

    return data.results as Movie[]
}

const requestMoviePage = async (endpoint: string, params?: TmdbParams): Promise<MoviePage> => {
    const data = await requestTmdb<TmdbMoviePageResponse>(endpoint, params)

    if (!Array.isArray(data.results)) {
        throw new Error("TMDB response did not include a movie list.")
    }

    return {
        movies: data.results as Movie[],
        page: data.page || 1,
        totalPages: data.total_pages || 1,
        totalResults: data.total_results || data.results.length
    }
}

export const getPopularMovies = (params: TmdbParams = {}): Promise<Movie[]> => {
    return requestMovies("/movie/popular", params)
}

export const getTrendingMovies = (): Promise<Movie[]> => {
    return requestMovies("/trending/movie/week")
}

export const getNowPlayingMovies = (): Promise<Movie[]> => {
    return requestMovies("/movie/now_playing")
}

export const getTopRatedMovies = (): Promise<Movie[]> => {
    return requestMovies("/movie/top_rated")
}

export const searchMovies = (query: string, params: TmdbParams = {}): Promise<Movie[]> => {
    return requestMovies("/search/movie", { query, ...params })
}

export const getMovieDetails = (movieId: number | string): Promise<MovieDetails> => {
    return requestTmdb<MovieDetails>(`/movie/${movieId}`)
}

export const discoverMovies = (params: TmdbParams = {}): Promise<MoviePage> => {
    return requestMoviePage("/discover/movie", {
        include_adult: false,
        include_video: false,
        language: "en-US",
        ...params
    })
}

export const searchMoviePage = (query: string, params: TmdbParams = {}): Promise<MoviePage> => {
    return requestMoviePage("/search/movie", {
        include_adult: false,
        language: "en-US",
        query,
        ...params
    })
}
