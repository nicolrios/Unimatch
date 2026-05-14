"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'Buscar', href: '/dashboard/search', icon: '🔍' },
    { name: 'Matches', href: '/dashboard/matches', icon: '💖' },
    { name: 'Mensajes', href: '/dashboard/messages', icon: '💬' },
    { name: 'Mi Perfil', href: '/dashboard/profile', icon: '👤' },
  ]

  return (
    <div className="w-64 min-h-screen bg-[#05070a] border-r border-white/5 flex flex-col p-6 z-50">
      <div className="mb-12">
        <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
          UniMatch
        </h1>
      </div>

      <nav className="flex-1 space-y-3">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                ? 'bg-gradient-to-r from-pink-600/10 to-blue-600/10 border border-pink-500/20 text-white' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-lg ${isActive ? 'drop-shadow-[0_0_8px_#ec4899]' : ''}`}>{link.icon}</span>
              <span className="text-sm font-bold tracking-tight">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-pink-500">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]"></span>
          SISTEMA ONLINE
        </div>
      </div>
    </div>
  )
}