"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [notifCount, setNotifCount] = useState(0)

  // Lógica Funcional: Consultar notificaciones cada 30 segundos
  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/notifications/count/${user.id}`)
        const data = await res.json()
        setNotifCount(data.count || 0)
      } catch (error) {
        console.error("Error al obtener notificaciones:", error)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Pooling cada 30 seg
    return () => clearInterval(interval)
  }, [user])

  const links = [
    { name: 'Buscar', href: '/dashboard/search', icon: '🔍' },
    { name: 'Matches', href: '/dashboard/matches', icon: '💖' },
    { name: 'Mensajes', href: '/dashboard/messages', icon: '💬' },
    { name: 'Mi Perfil', href: '/dashboard/profile', icon: '👤' },
  ]

  return (
    <div className="w-64 min-h-screen bg-[#05070a] border-r border-white/5 flex flex-col p-6 z-50">
      <div className="mb-12">
        <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent uppercase">
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
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-gradient-to-r from-pink-600/10 to-blue-600/10 border border-pink-500/20 text-white' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-lg ${isActive ? 'drop-shadow-[0_0_8px_#ec4899]' : ''}`}>
                  {link.icon}
                </span>
                <span className="text-sm font-bold tracking-tight">{link.name}</span>
              </div>

              {/* NOTIFICACIÓN FUNCIONAL EN EL BOTÓN DE MATCHES */}
              {link.name === 'Matches' && notifCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[9px] font-black text-white animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                  {notifCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer del Sidebar con el estado del Nodo */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_#ec4899]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">
              Nodo Online
            </span>
          </div>
          
          <div className="flex items-center gap-3 px-2">
            <img src={user?.imageUrl} className="w-8 h-8 rounded-lg border border-white/10" />
            <div className="overflow-hidden text-ellipsis">
              <p className="text-[10px] font-bold text-gray-200 truncate">{user?.fullName}</p>
              <p className="text-[8px] text-gray-600 font-black uppercase">Usuario Activo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}