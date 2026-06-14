import type { ReactNode } from "react"

interface EmptyStateProps {
    title: string
    description?: string
    className?: string
    children?: ReactNode
}

function EmptyState({ title, description, className = "", children = null }: EmptyStateProps) {
    return (
        <div className={className}>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
            {children}
        </div>
    )
}

export default EmptyState
