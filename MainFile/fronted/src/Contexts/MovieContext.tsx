import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { DEFAULT_WATCH_STATUS, VALID_WATCH_STATUSES } from "../constants/watchStatus"
import type { Library, WatchStatus } from "../types/library"
import type { Movie } from "../types/movie"
import { MovieContext, type MovieContextValue } from "./MovieContextCore"

type LibraryFlag = "favorite" | "watchlist"

interface LibraryFlags {
    favorite?: boolean
    watchlist?: boolean
    watchStatus?: WatchStatus
}

interface MovieProviderProps {
    children: ReactNode
}

const getMovieKey = (movieId: number | string): string => String(movieId)

const isWatchStatus = (status: unknown): status is WatchStatus => {
    return typeof status === "string" && VALID_WATCH_STATUSES.has(status as WatchStatus)
}

const getValidWatchStatus = (status: unknown): WatchStatus => {
    return isWatchStatus(status) ? status : DEFAULT_WATCH_STATUS
}

const readJson = <TFallback,>(key: string, fallback: TFallback): unknown | TFallback => {
    try {
        const storedValue = localStorage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : fallback
    } catch {
        return fallback
    }
}

const hasStoredValue = (key: string): boolean => {
    try {
        return localStorage.getItem(key) !== null
    } catch {
        return false
    }
}

const writeJson = (key: string, value: unknown): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // Library state remains available in memory when browser storage is unavailable.
    }
}

const isMovie = (movie: unknown): movie is Movie => {
    return Boolean(
        movie &&
        typeof movie === "object" &&
        "id" in movie &&
        typeof (movie as { id?: unknown }).id === "number"
    )
}

const addMovieToLibrary = (library: Library, movie: Movie, flags: LibraryFlags): Library => {
    if (!movie?.id) {
        return library
    }

    const currentEntry = library[getMovieKey(movie.id)]

    return {
        ...library,
        [movie.id]: {
            movie: currentEntry?.movie || movie,
            favorite: Boolean(currentEntry?.favorite || flags.favorite),
            watchlist: Boolean(currentEntry?.watchlist || flags.watchlist),
            watchStatus: getValidWatchStatus(currentEntry?.watchStatus || flags.watchStatus)
        }
    }
}

const normalizeLibrary = (library: unknown): Library => {
    if (!library || typeof library !== "object" || Array.isArray(library)) {
        return {}
    }

    return Object.entries(library).reduce<Library>((normalizedLibrary, [movieId, entry]) => {
        if (!entry || typeof entry !== "object" || !("movie" in entry) || !isMovie(entry.movie)) {
            return normalizedLibrary
        }

        const candidateEntry = entry as Partial<Library[string]>
        const favorite = Boolean(candidateEntry.favorite)
        const watchlist = Boolean(candidateEntry.watchlist)

        if (!favorite && !watchlist) {
            return normalizedLibrary
        }

        normalizedLibrary[movieId] = {
            movie: entry.movie,
            favorite,
            watchlist,
            watchStatus: watchlist ? getValidWatchStatus(candidateEntry.watchStatus) : DEFAULT_WATCH_STATUS
        }

        return normalizedLibrary
    }, {})
}

const getStoredMovies = (key: string): Movie[] => {
    const storedMovies = readJson(key, [])
    return Array.isArray(storedMovies) ? storedMovies.filter(isMovie) : []
}

const getStoredLibrary = (): Library => {
    const storedLibrary = normalizeLibrary(readJson("library", null))

    if (hasStoredValue("library")) {
        return storedLibrary
    }

    const favorites = getStoredMovies("favorites")
    const watchlist = getStoredMovies("watchlist")
    const migratedFavorites = favorites.reduce<Library>((library, movie) => {
        return addMovieToLibrary(library, movie, { favorite: true })
    }, {})

    return watchlist.reduce<Library>((library, movie) => {
        return addMovieToLibrary(library, movie, { watchlist: true })
    }, migratedFavorites)
}

const getLibraryMovies = (library: Library, key: LibraryFlag): Movie[] => {
    return Object.values(library)
        .filter((entry) => entry[key])
        .map((entry) => entry.movie)
}

const updateLibraryFlag = (movie: Movie, key: LibraryFlag, value: boolean) => (previousLibrary: Library): Library => {
    if (!movie?.id) {
        return previousLibrary
    }

    const currentEntry = previousLibrary[getMovieKey(movie.id)]

    return {
        ...previousLibrary,
        [movie.id]: {
            movie: currentEntry?.movie || movie,
            favorite: Boolean(currentEntry?.favorite),
            watchlist: Boolean(currentEntry?.watchlist),
            watchStatus: getValidWatchStatus(currentEntry?.watchStatus),
            [key]: value
        }
    }
}

const removeLibraryFlag = (movieId: number | string, key: LibraryFlag) => (previousLibrary: Library): Library => {
    const movieKey = getMovieKey(movieId)
    const currentEntry = previousLibrary[movieKey]

    if (!currentEntry) {
        return previousLibrary
    }

    const nextEntry = {
        ...currentEntry,
        [key]: false
    }

    if (!nextEntry.favorite && !nextEntry.watchlist) {
        const { [movieKey]: removedMovie, ...nextLibrary } = previousLibrary
        void removedMovie
        return nextLibrary
    }

    return {
        ...previousLibrary,
        [movieKey]: nextEntry
    }
}

const updateLibraryWatchStatus = (movieId: number | string, status: WatchStatus) => (previousLibrary: Library): Library => {
    const movieKey = getMovieKey(movieId)
    const currentEntry = previousLibrary[movieKey]

    if (!currentEntry?.watchlist) {
        return previousLibrary
    }

    return {
        ...previousLibrary,
        [movieKey]: {
            ...currentEntry,
            watchStatus: getValidWatchStatus(status)
        }
    }
}

export const MovieProvider = ({children}: MovieProviderProps) => {
    const [library, setLibrary] = useState(getStoredLibrary)

    useEffect(() => {
        writeJson("library", library)
    }, [library])

    const favorites = useMemo(() => getLibraryMovies(library, "favorite"), [library])
    const watchlist = useMemo(() => getLibraryMovies(library, "watchlist"), [library])

    const addToFavorites = (movie: Movie) => {
        setLibrary(updateLibraryFlag(movie, "favorite", true))
    }

    const removeFromFavorites = (movieId: number | string) => {
        setLibrary(removeLibraryFlag(movieId, "favorite"))
    }

    const isFavorite = (movieId: number | string) => {
        return Boolean(library[getMovieKey(movieId)]?.favorite)
    }

    const addToWatchlist = (movie: Movie) => {
        setLibrary((previousLibrary) => {
            const movieKey = getMovieKey(movie.id)
            const currentEntry = previousLibrary[movieKey]
            const nextLibrary = updateLibraryFlag(movie, "watchlist", true)(previousLibrary)

            if (!movie?.id) {
                return nextLibrary
            }

            return {
                ...nextLibrary,
                [movieKey]: {
                    ...nextLibrary[movieKey],
                    watchStatus: getValidWatchStatus(currentEntry?.watchStatus)
                }
            }
        })
    }

    const removeFromWatchlist = (movieId: number | string) => {
        setLibrary(removeLibraryFlag(movieId, "watchlist"))
    }

    const isInWatchlist = (movieId: number | string) => {
        return Boolean(library[getMovieKey(movieId)]?.watchlist)
    }

    const getWatchStatus = (movieId: number | string) => {
        return getValidWatchStatus(library[getMovieKey(movieId)]?.watchStatus)
    }

    const updateWatchStatus = (movieId: number | string, status: WatchStatus) => {
        setLibrary(updateLibraryWatchStatus(movieId, status))
    }

    const value: MovieContextValue = {
        library,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        getWatchStatus,
        updateWatchStatus
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}
