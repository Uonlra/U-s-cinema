import type { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    description?: string
    className?: string
    children?: ReactNode
}

function PageHeader({ title, description, className = "", children = null }: PageHeaderProps) {
    return (
        <header className={className}>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
            {children}
        </header>
    )
}

export default PageHeader
