import type { WatchStatus } from "../types/library"

export const DEFAULT_WATCH_STATUS: WatchStatus = "not-started"

export interface WatchStatusOption {
    label: string
    value: WatchStatus
}

export interface WatchStatusFilterOption {
    label: string
    value: WatchStatus | "all"
}

export const WATCH_STATUS_OPTIONS: WatchStatusOption[] = [
    { label: "Not Started", value: "not-started" },
    { label: "Watching", value: "watching" },
    { label: "Watched", value: "watched" }
]

export const WATCH_STATUS_FILTER_OPTIONS: WatchStatusFilterOption[] = [
    { label: "All", value: "all" },
    ...WATCH_STATUS_OPTIONS
]

export const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
    "not-started": "Not Started",
    watching: "Watching",
    watched: "Watched"
}

export const NEXT_WATCH_STATUS: Record<WatchStatus, WatchStatus> = {
    "not-started": "watching",
    watching: "watched",
    watched: "watching"
}

export const WATCH_STATUS_ACTION_LABELS: Record<WatchStatus, string> = {
    "not-started": "Start",
    watching: "Mark Watched",
    watched: "Rewatch"
}

export const VALID_WATCH_STATUSES = new Set<WatchStatus>(WATCH_STATUS_OPTIONS.map((option) => option.value))
