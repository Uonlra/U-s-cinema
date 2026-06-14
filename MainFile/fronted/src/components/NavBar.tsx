import type { FormEvent, KeyboardEvent } from 'react'
import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams, type NavigateFunction } from 'react-router-dom'
import '../css/Navbar.css'

const getNavLinkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? "active" : ""}`

interface NavSearchProps {
    currentSearchQuery: string
    currentPathname: string
    navigate: NavigateFunction
}

function NavSearch({ currentSearchQuery, currentPathname, navigate }: NavSearchProps) {
    const [searchValue, setSearchValue] = useState(currentPathname === '/' ? currentSearchQuery : '')

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const query = searchValue.trim()
        if (!query) {
            navigate('/')
            return
        }

        navigate(`/?q=${encodeURIComponent(query)}`)
    }

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.currentTarget.form?.requestSubmit()
        }
    }

    const handleClearSearch = () => {
        setSearchValue('')

        if (currentPathname === '/' && currentSearchQuery) {
            navigate('/')
        }
    }

    return (
        <form className="nav-search" role="search" onSubmit={handleSearchSubmit}>
            <span className="nav-search-icon" aria-hidden="true">⌕</span>
            <input
                type="search"
                placeholder="Search movies, shows..."
                aria-label="Search movies"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={handleSearchKeyDown}
            />
            {(searchValue || currentSearchQuery) && (
                <button
                    className="nav-search-clear"
                    type="button"
                    aria-label="Clear search"
                    onClick={handleClearSearch}
                >
                    <span aria-hidden="true">×</span>
                </button>
            )}
            <button className="nav-search-submit" type="submit" aria-label="Search movies">
                <span aria-hidden="true">⌘ K</span>
            </button>
        </form>
    )
}

function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const currentSearchQuery = searchParams.get('q') || ''

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-link" aria-label="u's cinema home">
                    <span className="brand-mark" aria-hidden="true">◎</span>
                    <span className="brand-name">u's cinema</span>
                </Link>
            </div>

            <div className="navbar-links">
                <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
                <NavLink to="/movies" className={getNavLinkClass}>Movies</NavLink>
                <NavLink to="/favorites" className={getNavLinkClass}>Favorites</NavLink>
                <NavLink to="/watchlist" className={getNavLinkClass}>Watchlist</NavLink>
            </div>

            <NavSearch
                key={`${location.pathname}-${currentSearchQuery}`}
                currentSearchQuery={currentSearchQuery}
                currentPathname={location.pathname}
                navigate={navigate}
            />

            <div className="navbar-actions" aria-label="User actions">
                <button className="notification-button" type="button" aria-label="Notifications">
                    <span aria-hidden="true">♧</span>
                </button>
                <div className="user-chip">
                    <span className="user-avatar" aria-hidden="true">un</span>
                    <span className="user-name">Uonlra</span>
                    <span className="user-chevron" aria-hidden="true">⌄</span>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
