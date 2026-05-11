"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { 
  Search, 
  MessageSquare, 
  User, 
  Heart, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Search, label: "Buscar", href: "/dashboard/search" },
  { icon: Heart, label: "Matches", href: "/dashboard/matches" },
  { icon: MessageSquare, label: "Mensajes", href: "/dashboard/chat" },
  { icon: User, label: "Mi Perfil", href: "/dashboard/profile" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">UniMatch</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex items-center gap-3">
          <UserButton /> {/* Eliminamos la propiedad que daba error */}
          <span className="text-sm font-medium text-foreground">Mi Cuenta</span>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-end px-8 md:hidden">
            <UserButton /> {/* Eliminamos aquí también */}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}