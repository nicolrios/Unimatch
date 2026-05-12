"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Users, Clock, Sparkles, MessageCircle, 
  Video, UserPlus, Bell, X, Check, Filter, Settings2, GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SimpleUser {
  id: string;
  name: string;
  img: string;
  career?: string;
  common?: string;
  match?: number;
}

export default function MatchesDashboard() {
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
    <TooltipProvider>
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* HEADER ACTUALIZADO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Mis Matches
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Gestiona tus compañeros de estudio.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/10 hover:bg-secondary/20 border border-white/5">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {data.pendientes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-background text-[9px] flex items-center justify-center font-bold">
                  {data.pendientes.length}
                </span>
              )}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: MATCHES ACTIVOS (AZUL UNIMATCH) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-400 font-bold px-2">
              <Users className="w-5 h-5" />
              <h2 className="tracking-wider uppercase text-[11px]">Matches Activos</h2>
            </div>

            <div className="space-y-4">
              {data.activos.map((m: SimpleUser) => (
                <Card key={m.id} className="bg-[#0f111a]/60 border-white/5 hover:border-blue-500/40 transition-all duration-300 group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Avatar className="h-14 w-14 rounded-2xl border border-blue-500/20">
                      <AvatarImage src={m.img} className="object-cover" />
                      <AvatarFallback className="bg-blue-500/10 text-blue-400">{m.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm truncate">{m.name}</p>
                      <p className="text-[10px] text-blue-400/80 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Conectado
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-blue-500/5 hover:bg-blue-500/20 text-blue-400 border border-blue-500/10">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5">
                          <Video className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* COLUMNA 2: SOLICITUDES (ÍNDIGO / VIOLETA) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400 font-bold px-2">
              <Clock className="w-5 h-5" />
              <h2 className="tracking-wider uppercase text-[11px]">Solicitudes</h2>
            </div>

            <div className="space-y-4">
              {data.pendientes.map((m: SimpleUser) => (
                <Card key={m.id} className="bg-[#0f111a]/60 border-indigo-500/20 hover:border-indigo-500/40 transition-all">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Avatar className="h-14 w-14 rounded-2xl border border-indigo-500/20">
                      <AvatarImage src={m.img} className="object-cover" />
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{m.name}</p>
                      <div className="flex gap-2 mt-3">
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 text-[11px] rounded-lg">
                          Aceptar
                        </Button>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-400 border border-red-500/10">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* COLUMNA 3: SUGERENCIAS (GRADIENTE PURPLE/BLUE) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-400 font-bold px-2">
              <Sparkles className="w-5 h-5" />
              <h2 className="tracking-wider uppercase text-[11px]">Sugerencias</h2>
            </div>

            <div className="space-y-4">
              {data.sugeridos.map((m: any) => (
                <Card key={m.id} className="bg-[#0f111a]/60 border-purple-500/10 hover:border-purple-500/30 transition-all group overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 rounded-full border border-purple-500/30 p-0.5">
                        <AvatarImage src={m.img} className="rounded-full object-cover" />
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{m.name}</h3>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> Ingeniería
                        </p>
                        <div className="mt-2">
                          <Badge className="text-[9px] bg-purple-500/10 text-purple-300 border-none px-2 font-medium">#{m.common || 'Estudio'}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold rounded-lg transition-all shadow-lg shadow-purple-900/20">
                      Conectar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </div>
    </TooltipProvider>
  )
}