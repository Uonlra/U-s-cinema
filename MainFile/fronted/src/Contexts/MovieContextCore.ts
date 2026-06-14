import { createContext, useContext } from "react"
import type { Library, WatchStatus } from "../types/library"
import type { Movie } from "../types/movie"

export interface MovieContextValue {
    library: Library
    favorites: Movie[]
    addToFavorites: (movie: Movie) => void
    removeFromFavorites: (movieId: number | string) => void
    isFavorite: (movieId: number | string) => boolean
    watchlist: Movie[]
    addToWatchlist: (movie: Movie) => void
    removeFromWatchlist: (movieId: number | string) => void
    isInWatchlist: (movieId: number | string) => boolean
    getWatchStatus: (movieId: number | string) => WatchStatus
    updateWatchStatus: (movieId: number | string, status: WatchStatus) => void
}

export const MovieContext = createContext<MovieContextValue | null>(null)

export const useMovieContext = (): MovieContextValue => {
    const context = useContext(MovieContext)

    if (!context) {
        throw new Error("useMovieContext must be used within a MovieProvider")
    }

    return context
}
