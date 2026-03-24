import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Trophy, Users, Newspaper, LogOut } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/matches', icon: Calendar, label: 'Matches' },
  { path: '/competitions', icon: Trophy, label: 'Compétitions' },
  { path: '/teams', icon: Users, label: 'Équipes' },
  { path: '/news', icon: Newspaper, label: 'Actualités' },
]

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">SportActual</h1>
          <p className="user-info">{user?.username}</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </aside>
      <main className="main-content">
        <header className="header">
          <h2>Bienvenue sur SportActual</h2>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}