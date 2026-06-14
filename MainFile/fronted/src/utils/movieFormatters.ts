import type { Movie } from "../types/movie"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780"
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w185"

type FormattableMovie = Pick<Movie, "backdrop_path" | "poster_path" | "release_date" | "vote_average"> | null | undefined

export const getMovieImage = (movie: FormattableMovie): string | null => {
    const imagePath = movie?.backdrop_path || movie?.poster_path
    return imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null
}

export const getMoviePoster = (movie: FormattableMovie): string | null => {
    return movie?.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null
}

export const getReleaseYear = (movie: FormattableMovie): string => movie?.release_date?.split("-")[0] || "Unknown"

export const getRating = (movie: FormattableMovie): string => {
    const rating = Number(movie?.vote_average || 0)
    return rating ? rating.toFixed(1) : "Not rated"
}
