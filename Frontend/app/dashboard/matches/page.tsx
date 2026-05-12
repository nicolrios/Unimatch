"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Users, Clock, Star, MessageSquare, 
  UserCheck, UserPlus, Bell, X, CheckCircle2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function MatchesDashboard() {
  const { user, isLoaded } = useUser()
  const [data, setData] = useState({ activos: [], pendientes: [], sugeridos: [] })
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/dashboard/${user.id}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Error al cargar el dashboard:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded && user) loadDashboard();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return <div className="p-10 text-center animate-pulse">Sincronizando conexiones...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header con Notificaciones */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Mis Matches</h1>
          <p className="text-muted-foreground italic">Gestiona tus solicitudes y compañeros de estudio.</p>
        </div>
        <div className="relative">
          <Button variant="outline" size="icon" className="rounded-full border-white/10 w-12 h-12">
            <Bell className="w-5 h-5" />
          </Button>
          {data.pendientes.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold">
              {data.pendientes.length}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA 1: MATCHES ACTIVOS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Activos ({data.activos.length})</h2>
          </div>
          <div className="space-y-3">
            {data.activos.length > 0 ? data.activos.map((m: any) => (
              <Card key={m.id} className="bg-card/40 border-white/5 hover:border-blue-500/30 transition-all group">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-xl">
                    <AvatarImage src={m.img} />
                    <AvatarFallback>{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{m.name}</p>
                    <p className="text-[10px] text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Conectado
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-blue-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="py-10 text-center border border-dashed rounded-2xl opacity-30 text-xs">
                Sin conexiones activas
              </div>
            )}
          </div>
        </section>

        {/* COLUMNA 2: PENDIENTES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Pendientes ({data.pendientes.length})</h2>
          </div>
          <div className="space-y-3">
            {data.pendientes.map((m: any) => (
              <Card key={m.id} className="bg-yellow-500/5 border-yellow-500/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-xl"><AvatarImage src={m.img} /></Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{m.name}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="h-7 bg-yellow-600 hover:bg-yellow-700 text-[10px] px-4 rounded-full">Aceptar</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-red-400 text-[10px] hover:bg-red-500/10">Rechazar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {data.pendientes.length === 0 && (
              <p className="text-center py-10 text-xs text-muted-foreground italic">No hay solicitudes nuevas.</p>
            )}
          </div>
        </section>

        {/* COLUMNA 3: SUGERIDOS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Star className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Sugerencias ({data.sugeridos.length})</h2>
          </div>
          <div className="space-y-3">
            {data.sugeridos.map((m: any) => (
              <Card key={m.id} className="bg-purple-500/5 border-purple-500/10 hover:border-purple-500/40 transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-xl"><AvatarImage src={m.img} /></Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{m.name}</p>
                    <Badge variant="secondary" className="text-[8px] bg-purple-500/20 text-purple-300 border-none">
                      #{m.common}
                    </Badge>
                  </div>
                  <Button size="icon" variant="ghost" className="text-purple-400 hover:bg-purple-500/20">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}