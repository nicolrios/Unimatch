"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Users, Clock, Sparkles, MessageCircle, 
  Video, UserPlus, Bell, X, GraduationCap, Zap 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface SimpleUser {
  id: string; name: string; img: string; career?: string; common?: string;
}

export default function FuturisticMatches() {
  const { user, isLoaded } = useUser()
  const [data, setData] = useState({ activos: [], pendientes: [], sugeridos: [] })
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/dashboard/${user.id}`);
      const json = await res.json();
      setData({
        activos: json.activos || [],
        pendientes: json.pendientes || [],
        sugeridos: json.sugeridos || []
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (isLoaded && user) loadDashboard(); }, [isLoaded, user]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-12 bg-[#02040a] text-white overflow-hidden relative">
      
      {/* Fondo Decorativo Futurista */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      {/* HEADER IMPACTANTE */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3 fill-current" /> Sistema de Match Activo
          </div>
          <h1 className="text-6xl font-black tracking-tighter">
            Mis <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">Matches</span>
          </h1>
          <p className="text-gray-400 font-medium">Gestiona tus compañeros de estudio.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <Button variant="ghost" size="icon" className="relative h-14 w-14 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl">
              <Bell className="w-6 h-6 text-white" />
              {data.pendientes.length > 0 && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* GRID DE COLUMNAS CON ESTILO GLASS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* COLUMNA: ACTIVOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">En Conexión</h2>
          </div>

          <div className="space-y-4">
            {data.activos.length > 0 ? data.activos.map((m: SimpleUser) => (
              <Card key={m.id} className="group relative bg-white/[0.03] border-white/5 backdrop-blur-md hover:bg-white/[0.07] transition-all duration-500 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 flex items-center gap-5">
                  <Avatar className="h-16 w-16 rounded-2xl border-2 border-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                    <AvatarImage src={m.img} className="object-cover" />
                    <AvatarFallback>{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate text-white">{m.name}</p>
                    <div className="flex gap-3 mt-3">
                      <Button size="icon" className="h-9 w-9 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button size="icon" className="h-9 w-9 rounded-xl bg-white/5 text-white/40 hover:bg-white/10">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : <EmptyState text="Sin matches activos" color="blue" />}
          </div>
        </section>

        {/* COLUMNA: SOLICITUDES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Solicitudes</h2>
          </div>

          <div className="space-y-4">
            {data.pendientes.map((m: SimpleUser) => (
              <Card key={m.id} className="bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 backdrop-blur-md rounded-3xl overflow-hidden">
                <CardContent className="p-6 flex items-center gap-5">
                  <Avatar className="h-16 w-16 rounded-2xl border-2 border-indigo-500/20">
                    <AvatarImage src={m.img} className="object-cover" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white mb-3">{m.name}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 rounded-xl text-xs uppercase tracking-tighter">
                        Aceptar
                      </Button>
                      <Button variant="ghost" className="h-9 w-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {data.pendientes.length === 0 && <EmptyState text="No hay solicitudes" color="indigo" />}
          </div>
        </section>

        {/* COLUMNA: SUGERENCIAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-purple-400">Sugerencias</h2>
          </div>

          <div className="space-y-4">
            {data.sugeridos.map((m: any) => (
              <Card key={m.id} className="group bg-white/[0.02] border-white/5 hover:border-purple-500/40 transition-all duration-500 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                      <Avatar className="h-14 w-14 rounded-full p-1 border border-purple-500/30">
                        <AvatarImage src={m.img} className="rounded-full object-cover" />
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-md text-white">{m.name}</h3>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-bold uppercase tracking-widest">
                        <GraduationCap className="w-3 h-3" /> Ingeniería
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-purple-500/10 text-purple-300 border-none px-2 py-0.5 text-[9px]">#{m.common || 'UML'}</Badge>
                  </div>
                  <Button className="w-full mt-5 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-900/20">
                    Conectar
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

function EmptyState({ text, color }: { text: string, color: string }) {
  return (
    <div className={`py-12 text-center border border-dashed border-${color}-500/20 rounded-3xl opacity-40`}>
      <p className="text-xs font-bold uppercase tracking-[0.3em]">{text}</p>
    </div>
  )
}