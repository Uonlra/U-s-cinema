import type { ReactNode } from "react"
import { useCallback, useMemo, useState } from "react"
import { MovieDetailsModalContext, type MovieDetailsModalContextValue } from "./MovieDetailsModalContext"

interface MovieDetailsModalProviderProps {
    children: ReactNode
}

export function MovieDetailsModalProvider({ children }: MovieDetailsModalProviderProps) {
    const [selectedMovieId, setSelectedMovieId] = useState<number | string | null>(null)

    const openMovieDetails = useCallback((movieId: number | string) => {
        if (!movieId) {
            return
        }

        setSelectedMovieId(movieId)
    }, [])

    const closeMovieDetails = useCallback(() => {
        setSelectedMovieId(null)
    }, [])

    const value = useMemo<MovieDetailsModalContextValue>(() => ({
        selectedMovieId,
        openMovieDetails,
        closeMovieDetails
    }), [closeMovieDetails, openMovieDetails, selectedMovieId])

    return (
        <MovieDetailsModalContext.Provider value={value}>
            {children}
        </MovieDetailsModalContext.Provider>
    )
}
