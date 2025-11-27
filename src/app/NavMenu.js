
import Link from 'next/link';
import { useTheme } from './ThemeContext';

export default function NavMenu({ active }) {
  const { theme, toggleTheme } = useTheme();
  
  const navItems = [
    { name: 'Dashboard', href: '/', icon: '🏠', ariaLabel: 'Go to Dashboard' },
    { name: 'Breathing', href: '/breathing', icon: '🌬️', ariaLabel: 'Go to Breathing Exercise' },
    { name: 'Canvas', href: '/canvas', icon: '🎨', ariaLabel: 'Go to Drawing Canvas' },
    { name: 'Sounds', href: '/sounds', icon: '🎵', ariaLabel: 'Go to Ambient Sounds' },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className="w-full flex justify-center px-1 sm:px-4 z-50"
    >
      <div className={`w-full max-w-5xl mx-auto rounded-3xl px-2 sm:px-4 py-2 flex items-center justify-between gap-2 transition-all duration-300 shadow-lg border ${
        theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-white/50'
      } backdrop-blur-md`}>
        
        {/* Brand */}
        <Link href="/" aria-label="SkyCalm Home" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-200 to-pink-100 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
          >
            {/* Paper airplane SVG top-down view */}
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <polygon points="14,4 24,24 14,18 4,24 14,4" fill="#38bdf8" stroke="#0f766e" strokeWidth="1.2" />
              <line x1="14" y1="4" x2="14" y2="18" stroke="#0f766e" strokeWidth="1" />
            </svg>
          </div>
          <div className="hidden xs:flex flex-col leading-tight">
            <span className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'}`}>SkyCalm</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-2" role="menubar">
          {navItems.map((item) => {
            const isActive = active === item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                role="menuitem"
              >
                <div
                  className={`relative px-3 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isActive 
                      ? (theme === 'dark' ? 'bg-teal-800 text-teal-100 shadow-md' : 'bg-teal-100 text-teal-800 shadow-md')
                      : (theme === 'dark' ? 'text-teal-300 hover:bg-gray-700' : 'text-teal-600 hover:bg-teal-50')
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden sm:inline text-xs font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-90 ${
            theme === 'dark' ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-yellow-100 text-orange-500 hover:bg-yellow-200'
          }`}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
