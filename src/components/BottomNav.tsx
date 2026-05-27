import { NavLink } from 'react-router-dom'
import { Dumbbell, TrendingUp, Calendar, Trophy } from 'lucide-react'

const tabs = [
  { to: '/',            icon: Dumbbell,   label: 'Today' },
  { to: '/progress',    icon: TrendingUp, label: 'Progress' },
  { to: '/program',     icon: Calendar,   label: 'Program' },
  { to: '/benchmarks',  icon: Trophy,     label: 'Benchmarks' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 glass-nav">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-white/30 hover:text-white/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
