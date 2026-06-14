import { useCallback, useEffect, useMemo, useState } from "react"

interface FeaturedCarouselState<TMovie> {
    activeIndex: number
    activeMovie: TMovie | null
    resetCarousel: () => void
    showMovie: (nextIndex: number) => void
    showNext: () => void
    showPrevious: () => void
    onHoverStart: () => void
    onHoverEnd: () => void
    onFocusStart: () => void
    onFocusEnd: () => void
}

function useFeaturedCarousel<TMovie>(movies: TMovie[], intervalMs = 5000): FeaturedCarouselState<TMovie> {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const movieCount = movies.length
    const activeMovie = movies[activeIndex] || null

    const resetCarousel = useCallback(() => {
        setActiveIndex(0)
        setIsHovered(false)
        setIsFocused(false)
    }, [])

    const showMovie = useCallback((nextIndex: number) => {
        setActiveIndex(() => {
            if (movieCount === 0) {
                return 0
            }

            return (nextIndex + movieCount) % movieCount
        })
    }, [movieCount])

    const showNext = useCallback(() => {
        setActiveIndex((currentIndex) => {
            if (movieCount <= 1) {
                return currentIndex
            }

            return (currentIndex + 1) % movieCount
        })
    }, [movieCount])

    const showPrevious = useCallback(() => {
        setActiveIndex((currentIndex) => {
            if (movieCount <= 1) {
                return currentIndex
            }

            return (currentIndex - 1 + movieCount) % movieCount
        })
    }, [movieCount])

    const pauseOnHover = useMemo(() => ({
        onHoverStart: () => setIsHovered(true),
        onHoverEnd: () => setIsHovered(false)
    }), [])

    const pauseOnFocus = useMemo(() => ({
        onFocusStart: () => setIsFocused(true),
        onFocusEnd: () => setIsFocused(false)
    }), [])

    useEffect(() => {
        const isPaused = isHovered || isFocused

        if (movieCount <= 1 || isPaused) {
            return undefined
        }

        const intervalId = window.setInterval(showNext, intervalMs)

        return () => window.clearInterval(intervalId)
    }, [activeIndex, intervalMs, isFocused, isHovered, movieCount, showNext])

    return {
        activeIndex,
        activeMovie,
        resetCarousel,
        showMovie,
        showNext,
        showPrevious,
        ...pauseOnHover,
        ...pauseOnFocus
    }
}

export default useFeaturedCarousel
