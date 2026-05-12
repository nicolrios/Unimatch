"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Users, Clock, Sparkles, MessageCircle, 
  Video, UserPlus, Bell, X, Check, Filter, Settings2
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

export default function ModernMatchesDashboard() {
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
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10 bg-background min-h-screen text-foreground animate-in fade-in duration-1000">
        
        {/* HEADER MODERNO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Mis Matches
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Gestiona tus compañeros de estudio y solicitudes con IA.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/20 hover:bg-secondary/40 h-11 w-11 border border-white/5">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/20 hover:bg-secondary/40 h-11 w-11 border border-white/5 relative">
              <Bell className="w-5 h-5" />
              {data.pendientes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-background text-[10px] flex items-center justify-center font-bold animate-bounce">
                  {data.pendientes.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/20 hover:bg-secondary/40 h-11 w-11 border border-white/5">
              <Settings2 className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: MATCHES ACTIVOS (AZUL NEÓN) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-blue-400 font-bold">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-5 h-5" /></div>
                <h2 className="tracking-widest uppercase text-xs">Matches Activos</h2>
              </div>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-3">{data.activos.length}</Badge>
            </div>

            <div className="space-y-4">
              {data.activos.map((m: SimpleUser) => (
                <Card key={m.id} className="group relative overflow-hidden bg-[#0a0c14] border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                      <Avatar className="h-16 w-16 rounded-2xl border-2 border-blue-500/20 relative">
                        <AvatarImage src={m.img} className="object-cover" />
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-lg leading-none">{m.name}</p>
                      <p className="text-[11px] text-blue-400 font-bold uppercase tracking-tighter">En línea - 2 horas</p>
                      <div className="flex gap-2 pt-2">
                        <Tooltip><TooltipTrigger asChild>
                          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger><TooltipContent>Enviar Mensaje</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild>
                          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5">
                            <Video className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger><TooltipContent>Videollamada</TooltipContent></Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* COLUMNA 2: SOLICITUDES (DORADO) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-amber-400 font-bold">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="w-5 h-5" /></div>
                <h2 className="tracking-widest uppercase text-xs">Solicitudes</h2>
              </div>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5 px-3">{data.pendientes.length}</Badge>
            </div>

            <div className="space-y-4">
              {data.pendientes.map((m: SimpleUser) => (
                <Card key={m.id} className="bg-[#0a0c14] border-amber-500/10 hover:border-amber-500/40 transition-all group shadow-2xl">
                  <CardContent className="p-6 flex items-center gap-5">
                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-amber-500/10">
                      <AvatarImage src={m.img} className="object-cover" />
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{m.name}</p>
                      <div className="flex gap-2 mt-3">
                        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold h-9 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                          Aceptar
                        </Button>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-400 border border-red-500/10">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* COLUMNA 3: SUGERENCIAS (PÚRPURA/AI) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-purple-400 font-bold">
                <div className="p-2 bg-purple-500/10 rounded-lg"><Sparkles className="w-5 h-5" /></div>
                <h2 className="tracking-widest uppercase text-xs">Sugerencias AI</h2>
              </div>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/5 px-3">{data.sugeridos.length}</Badge>
            </div>

            <div className="space-y-4">
              {data.sugeridos.map((m: any) => (
                <Card key={m.id} className="relative bg-[#0a0c14] border-purple-500/10 hover:border-purple-500/40 transition-all overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-3xl -mr-10 -mt-10"></div>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-14 w-14">
                        <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent opacity-40"></div>
                        <Avatar className="h-14 w-14 rounded-full p-1 border border-white/5">
                          <AvatarImage src={m.img} className="rounded-full object-cover" />
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-[#0a0c14] border border-purple-500/30 rounded-full p-1 shadow-lg">
                          <div className="text-[8px] font-black text-purple-400">88%</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-md leading-tight">{m.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-1">
                          Ingeniería en Sistemas
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-[8px] bg-purple-500/10 text-purple-200 border-none px-2 py-0">#{m.common || 'UML'}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <Button className="flex-1 h-9 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        Conectar
                      </Button>
                      <Button variant="ghost" className="flex-1 h-9 rounded-xl text-[10px] text-muted-foreground hover:text-white">
                        Saber más
                      </Button>
                    </div>
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