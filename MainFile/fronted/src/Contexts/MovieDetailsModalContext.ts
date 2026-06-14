import { createContext, useContext } from "react"

export interface MovieDetailsModalContextValue {
    selectedMovieId: number | string | null
    openMovieDetails: (movieId: number | string) => void
    closeMovieDetails: () => void
}

export const MovieDetailsModalContext = createContext<MovieDetailsModalContextValue | null>(null)

export const useMovieDetailsModal = (): MovieDetailsModalContextValue => {
    const context = useContext(MovieDetailsModalContext)

    if (!context) {
        throw new Error("useMovieDetailsModal must be used within a MovieDetailsModalProvider")
    }

    return context
}
