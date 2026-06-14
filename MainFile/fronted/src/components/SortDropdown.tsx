import type { KeyboardEvent } from "react"
import { useEffect, useRef, useState } from "react"

export interface SortOption<TValue extends string = string> {
    label: string
    value: TValue
}

interface SortDropdownProps<TValue extends string = string> {
    options: SortOption<TValue>[]
    value: TValue
    onChange: (value: TValue) => void
}

const isContainedTarget = (container: HTMLElement, target: EventTarget | null): boolean => {
    return target instanceof Node && container.contains(target)
}

function SortDropdown<TValue extends string = string>({ options, value, onChange }: SortDropdownProps<TValue>) {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const selectedOption = options.find((option) => option.value === value) || options[0]

    useEffect(() => {
        if (!open) {
            return undefined
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (dropdownRef.current && !isContainedTarget(dropdownRef.current, event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)

        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [open])

    const handleOptionSelect = (nextValue: TValue) => {
        onChange(nextValue)
        setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Escape") {
            setOpen(false)
            return
        }

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
        }
    }

    return (
        <div className="sort-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className="sort-trigger"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((currentOpen) => !currentOpen)}
                onKeyDown={handleKeyDown}
            >
                <span className="sort-label">Sort by:</span>
                <span className="sort-value">{selectedOption.label}</span>
                <span className={`sort-chevron ${open ? "open" : ""}`} aria-hidden="true">⌄</span>
            </button>

            {open && (
                <div className="sort-menu" role="listbox" aria-label="Sort movies">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`sort-option ${option.value === value ? "active" : ""}`}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleOptionSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SortDropdown
