import type { Movie } from "./movie"

export type WatchStatus = "not-started" | "watching" | "watched"

export interface LibraryEntry {
  movie: Movie
  favorite: boolean
  watchlist: boolean
  watchStatus: WatchStatus
}

export type Library = Record<string, LibraryEntry>
