"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Users, Clock, Star, MessageSquare, 
  UserCheck, UserPlus, Bell, X 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Definimos las estructuras de datos para evitar errores de 'never' o 'any'
interface SimpleUser {
  id: string;
  name: string;
  img: string;
  common?: string;
}

interface DashboardData {
  activos: SimpleUser[];
  pendientes: SimpleUser[];
  sugeridos: SimpleUser[];
}

export default function MatchesDashboard() {
  const { user, isLoaded } = useUser()
  const [data, setData] = useState<DashboardData>({ activos: [], pendientes: [], sugeridos: [] })
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/dashboard/${user.id}`);
      if (!res.ok) throw new Error("Error en el servidor");
      const json = await res.json();
      
      // Validamos que cada lista exista y sea un array para que .map() no falle
      setData({
        activos: Array.isArray(json.activos) ? json.activos : [],
        pendientes: Array.isArray(json.pendientes) ? json.pendientes : [],
        sugeridos: Array.isArray(json.sugeridos) ? json.sugeridos : []
      });
    } catch (e) {
      console.error("Fallo al cargar dashboard:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded && user) loadDashboard();
  }, [isLoaded, user]);

  if (!isLoaded) return <div className="p-10 text-center">Cargando identidad...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header con Campana de Notificaciones */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black">Panel de Matches</h1>
          <p className="text-muted-foreground text-sm italic">Tus conexiones universitarias en tiempo real.</p>
        </div>
        <div className="relative">
          <Button variant="outline" size="icon" className="rounded-full border-white/10 h-11 w-11">
            <Bell className="w-5 h-5" />
          </Button>
          {data.pendientes.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-4 border-background text-[10px] flex items-center justify-center font-bold">
              {data.pendientes.length}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center opacity-50">Sincronizando con el servidor...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA 1: ACTIVOS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold px-1">
              <UserCheck className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-tighter">Activos ({data.activos.length})</h2>
            </div>
            <div className="space-y-3">
              {data.activos.map((m) => (
                <Card key={m.id} className="bg-card/40 border-white/5 hover:bg-card/80 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded-xl border border-white/5">
                      <AvatarImage src={m.img} />
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate">{m.name}</p>
                      <p className="text-[10px] text-green-500 font-bold uppercase">Compañero</p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-blue-400 hover:bg-blue-400/10">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {data.activos.length === 0 && <p className="text-[10px] text-center opacity-30 py-4 border border-dashed rounded-xl">Sin matches activos</p>}
            </div>
          </section>

          {/* COLUMNA 2: PENDIENTES */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-500 font-bold px-1">
              <Clock className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-tighter">Solicitudes ({data.pendientes.length})</h2>
            </div>
            <div className="space-y-3">
              {data.pendientes.map((m) => (
                <Card key={m.id} className="bg-yellow-500/5 border-yellow-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-lg"><AvatarImage src={m.img} /></Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold truncate">{m.name}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="h-6 px-3 bg-yellow-600 text-[9px] font-bold rounded-full">Aceptar</Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-red-400 text-[9px]"><X className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {data.pendientes.length === 0 && <p className="text-[10px] text-center opacity-30 py-4 border border-dashed rounded-xl">No hay solicitudes</p>}
            </div>
          </section>

          {/* COLUMNA 3: SUGERIDOS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold px-1">
              <Star className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-tighter">Sugeridos ({data.sugeridos.length})</h2>
            </div>
            <div className="space-y-3">
              {data.sugeridos.map((m) => (
                <Card key={m.id} className="bg-purple-500/5 border-purple-500/10 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-lg"><AvatarImage src={m.img} /></Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold truncate">{m.name}</p>
                      <Badge variant="secondary" className="text-[8px] bg-purple-500/20 text-purple-300 border-none px-1 h-4 uppercase">
                        #{m.common || 'Estudio'}
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
      )}
    </div>
  )
}