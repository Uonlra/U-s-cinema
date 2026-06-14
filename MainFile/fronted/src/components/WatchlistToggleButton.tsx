import type { MouseEvent } from "react"
import type { Movie } from "../types/movie"

interface WatchlistToggleButtonProps {
    movie: Movie
    inWatchlist: boolean
    onToggle: (movie: Movie) => void
    className?: string
}

function WatchlistToggleButton({ movie, inWatchlist, onToggle, className = "" }: WatchlistToggleButtonProps) {
    return (
        <button
            type="button"
            className={`watchlist-toggle ${inWatchlist ? "active" : ""} ${className}`}
            aria-label={`${inWatchlist ? "Remove" : "Add"} ${movie.title} ${inWatchlist ? "from" : "to"} watchlist`}
            aria-pressed={inWatchlist}
            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                event.stopPropagation()
                onToggle(movie)
            }}
        >
            <span aria-hidden="true">{inWatchlist ? "✓" : "＋"}</span>
        </button>
    )
}

export default WatchlistToggleButton
