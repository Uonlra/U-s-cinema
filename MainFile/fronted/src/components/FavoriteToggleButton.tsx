import type { MouseEvent } from "react"
import type { Movie } from "../types/movie"

interface FavoriteToggleButtonProps {
    movie: Movie
    favorite: boolean
    onToggle: (movie: Movie) => void
    className?: string
}

function FavoriteToggleButton({ movie, favorite, onToggle, className = "" }: FavoriteToggleButtonProps) {
    return (
        <button
            type="button"
            className={`favorite-toggle ${favorite ? "active" : ""} ${className}`}
            aria-label={`${favorite ? "Remove" : "Add"} ${movie.title} ${favorite ? "from" : "to"} favorites`}
            aria-pressed={favorite}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                event.stopPropagation()
                onToggle(movie)
            }}
        >
            <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
        </button>
    )
}

export default FavoriteToggleButton
