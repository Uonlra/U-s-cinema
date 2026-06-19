import type { FormEvent, KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams, type NavigateFunction } from 'react-router-dom'
import '../css/Navbar.css'

const getNavLinkClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? "active" : ""}`

type NavbarMenu = 'notifications' | 'user' | null

const notifications = [
    {
        title: 'New trailer released',
        description: 'A fresh preview is now available for your weekly picks.',
        time: '2m ago'
    },
    {
        title: 'Movie added to watchlist',
        description: 'Your latest saved title is ready in Watchlist.',
        time: '18m ago'
    },
    {
        title: 'Weekly top picks ready',
        description: 'Trending, top rated, and new releases have refreshed.',
        time: '1h ago'
    },
    {
        title: 'Favorite list updated',
        description: 'One of your favorites has new rating activity.',
        time: 'Today'
    }
]

const userMenuItems = ['Profile', 'Settings', 'Theme', 'Sign out']

const isContainedTarget = (container: HTMLElement, target: EventTarget | null): boolean => {
    return target instanceof Node && container.contains(target)
}

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
    const [openMenu, setOpenMenu] = useState<NavbarMenu>(null)
    const actionsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!openMenu) {
            return undefined
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (actionsRef.current && !isContainedTarget(actionsRef.current, event.target)) {
                setOpenMenu(null)
            }
        }

        const handleKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenMenu(null)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [openMenu])

    const toggleMenu = (menu: Exclude<NavbarMenu, null>) => {
        setOpenMenu((currentMenu) => currentMenu === menu ? null : menu)
    }

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

            <div className="navbar-actions" aria-label="User actions" ref={actionsRef}>
                <div className="navbar-menu-anchor">
                    <button
                        className={`notification-button ${openMenu === 'notifications' ? 'active' : ''}`}
                        type="button"
                        aria-label="Notifications"
                        aria-haspopup="menu"
                        aria-expanded={openMenu === 'notifications'}
                        onClick={() => toggleMenu('notifications')}
                    >
                        <span aria-hidden="true">♧</span>
                    </button>

                    {openMenu === 'notifications' && (
                        <div className="navbar-dropdown notifications-dropdown" role="menu" aria-label="Notifications menu">
                            <div className="dropdown-header">
                                <span>Notifications</span>
                                <small>{notifications.length} new</small>
                            </div>
                            <div className="notification-list">
                                {notifications.map((notification) => (
                                    <button className="notification-item" type="button" role="menuitem" key={notification.title}>
                                        <span className="notification-dot" aria-hidden="true"></span>
                                        <span className="notification-copy">
                                            <strong>{notification.title}</strong>
                                            <span>{notification.description}</span>
                                        </span>
                                        <time>{notification.time}</time>
                                    </button>
                                ))}
                            </div>
                            <button className="dropdown-footer-action" type="button">View all</button>
                        </div>
                    )}
                </div>

                <div className="navbar-menu-anchor">
                    <button
                        className={`user-chip ${openMenu === 'user' ? 'active' : ''}`}
                        type="button"
                        aria-label="Open user menu"
                        aria-haspopup="menu"
                        aria-expanded={openMenu === 'user'}
                        onClick={() => toggleMenu('user')}
                    >
                        <span className="user-avatar" aria-hidden="true">un</span>
                        <span className="user-name">Uonlra</span>
                        <span className="user-chevron" aria-hidden="true">⌄</span>
                    </button>

                    {openMenu === 'user' && (
                        <div className="navbar-dropdown user-dropdown" role="menu" aria-label="User menu">
                            <div className="user-menu-head">
                                <span className="user-avatar large" aria-hidden="true">un</span>
                                <div>
                                    <strong>Uonlra</strong>
                                    <span>Movie library member</span>
                                </div>
                            </div>
                            <div className="user-menu-list">
                                {userMenuItems.map((item) => (
                                    <button className="user-menu-item" type="button" role="menuitem" key={item}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar
