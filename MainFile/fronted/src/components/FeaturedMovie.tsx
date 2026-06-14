import type { FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react"
import { useEffect, useRef } from "react"
import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import type { Movie } from "../types/movie"
import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"
import FavoriteToggleButton from "./FavoriteToggleButton"
import WatchlistToggleButton from "./WatchlistToggleButton"

interface FeaturedMovieProps {
    movie: Movie
    movies?: Movie[]
    activeIndex?: number
    eyebrow: string
    favorite: boolean
    inWatchlist: boolean
    onSelectMovie?: (index: number) => void
    onShowNext?: () => void
    onShowPrevious?: () => void
    onHoverStart?: () => void
    onHoverEnd?: () => void
    onFocusStart?: () => void
    onFocusEnd?: () => void
    onToggleFavorite: (movie: Movie) => void
    onToggleWatchlist: (movie: Movie) => void
}

const isContainedTarget = (container: HTMLElement, target: EventTarget | null): boolean => {
    return target instanceof Node && container.contains(target)
}

function FeaturedMovie({
    movie,
    movies = [],
    activeIndex = 0,
    eyebrow,
    favorite,
    inWatchlist,
    onSelectMovie,
    onShowNext,
    onShowPrevious,
    onHoverStart,
    onHoverEnd,
    onFocusStart,
    onFocusEnd,
    onToggleFavorite,
    onToggleWatchlist
}: FeaturedMovieProps) {
    const { openMovieDetails } = useMovieDetailsModal()
    const featuredImage = getMovieImage(movie)
    const canSwitchMovies = movies.length > 1
    const featuredPanelRef = useRef<HTMLElement | null>(null)
    const rating = getRating(movie)

    useEffect(() => {
        const handlePointerMove = (event: globalThis.PointerEvent) => {
            if (featuredPanelRef.current && isContainedTarget(featuredPanelRef.current, event.target)) {
                onHoverStart?.()
                return
            }

            onHoverEnd?.()
        }

        window.addEventListener("pointermove", handlePointerMove)

        return () => window.removeEventListener("pointermove", handlePointerMove)
    }, [onHoverEnd, onHoverStart])

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (!canSwitchMovies) {
            return
        }

        if (event.key === "ArrowRight") {
            event.preventDefault()
            onShowNext?.()
            return
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault()
            onShowPrevious?.()
        }
    }

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
        if (!isContainedTarget(event.currentTarget, event.relatedTarget)) {
            onFocusEnd?.()
        }
    }

    const handleHoverEnd = (event: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>) => {
        if (!isContainedTarget(event.currentTarget, event.relatedTarget)) {
            onHoverEnd?.()
        }
    }

    return (
        <article
            ref={featuredPanelRef}
            className="featured-panel"
            tabIndex={0}
            aria-label={`Featured movie: ${movie.title}`}
            onPointerEnter={onHoverStart}
            onPointerMove={onHoverStart}
            onPointerLeave={onHoverEnd}
            onPointerOut={handleHoverEnd}
            onMouseEnter={onHoverStart}
            onMouseMove={onHoverStart}
            onMouseLeave={onHoverEnd}
            onMouseOut={handleHoverEnd}
            onFocus={onFocusStart}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        >
            <div className="featured-art">
                <div key={`featured-art-${movie.id}`} className="featured-art-media">
                    {featuredImage ? (
                        <img src={featuredImage} alt={movie.title} />
                    ) : (
                        <div className="featured-placeholder">Featured movie</div>
                    )}
                </div>
                <button
                    type="button"
                    className="featured-art-link"
                    aria-label={`View details for ${movie.title}`}
                    onClick={() => openMovieDetails(movie.id)}
                />
                <FavoriteToggleButton
                    movie={movie}
                    favorite={favorite}
                    onToggle={onToggleFavorite}
                    className="featured-favorite"
                />
                <WatchlistToggleButton
                    movie={movie}
                    inWatchlist={inWatchlist}
                    onToggle={onToggleWatchlist}
                    className="featured-watchlist"
                />
                <div className="featured-dots" role="group" aria-label="Featured movie selector">
                    {movies.map((featuredMovie, index) => (
                        <button
                            key={featuredMovie.id}
                            type="button"
                            className={index === activeIndex ? "active" : ""}
                            aria-label={`Show ${featuredMovie.title}`}
                            aria-pressed={index === activeIndex}
                            onClick={() => onSelectMovie?.(index)}
                        />
                    ))}
                </div>
            </div>

            <div key={`featured-copy-${movie.id}`} className="featured-copy">
                <p className="eyebrow">{eyebrow}</p>
                <h1>{movie.title}</h1>
                <div className="featured-meta">
                    <span>{getReleaseYear(movie)}</span>
                    <span>3h 0m</span>
                    <span>R</span>
                    <span>Drama</span>
                    <span>History</span>
                </div>
                <div className="featured-rating">
                    <span>★</span>
                    <strong>{rating}</strong>
                    {rating !== "Not rated" && <span>/10</span>}
                    {rating !== "Not rated" && <mark>IMDb</mark>}
                </div>
                <p className="featured-description">
                    {movie.overview || "A cinematic story with striking characters, high-stakes choices, and an atmosphere built for the big screen."}
                </p>
                <div className="featured-actions">
                    <button
                        type="button"
                        className="details-button featured-details-link"
                        onClick={() => openMovieDetails(movie.id)}
                    >
                        <span aria-hidden="true">↗</span>
                        View Details
                    </button>
                </div>
            </div>
        </article>
    )
}

export default FeaturedMovie
