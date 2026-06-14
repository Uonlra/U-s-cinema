export interface MovieGenreFilter {
    label: string
    value: string
}

export type LibrarySortValue = "rating" | "year" | "title"

export interface LibrarySortOption {
    label: string
    value: LibrarySortValue
}

export const MOVIE_GENRE_FILTERS: MovieGenreFilter[] = [
    { label: "All", value: "" },
    { label: "Action", value: "28" },
    { label: "Drama", value: "18" },
    { label: "Sci-Fi", value: "878" },
    { label: "Thriller", value: "53" },
    { label: "Comedy", value: "35" }
]

export const MOVIE_GENRE_NAMES: Record<number, string> = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    36: "History",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Sci-Fi",
    9648: "Mystery",
    10402: "Music",
    10749: "Romance",
    10751: "Family",
    10752: "War",
    10770: "TV Movie"
}

export const LIBRARY_SORT_OPTIONS: LibrarySortOption[] = [
    { label: "Rating", value: "rating" },
    { label: "Release Year", value: "year" },
    { label: "Title", value: "title" }
]
