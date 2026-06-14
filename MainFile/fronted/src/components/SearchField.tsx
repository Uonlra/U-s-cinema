import type { FormEvent } from "react"

interface SearchFieldProps {
    value: string
    onChange: (value: string) => void
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void
    placeholder: string
    ariaLabel: string
    className?: string
    icon?: string
}

function SearchField({
    value,
    onChange,
    onSubmit,
    placeholder,
    ariaLabel,
    className = "",
    icon = "⌕"
}: SearchFieldProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit?.(event)
    }

    return (
        <form className={className} role="search" onSubmit={handleSubmit}>
            <span aria-hidden="true">{icon}</span>
            <input
                type="search"
                placeholder={placeholder}
                aria-label={ariaLabel}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </form>
    )
}

export default SearchField
