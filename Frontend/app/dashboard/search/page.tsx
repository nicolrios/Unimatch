"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Search, Sparkles, MessageSquare, UserPlus, GraduationCap, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SearchPage() {
  const { user } = useUser()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  const handleSearch = async () => {
    setLoading(true);
    try {
      const myProfile = JSON.parse(localStorage.getItem('unimatch_profile') || '{}');
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/search?q=${query}&clerkId=${user?.id}&carrera=${myProfile.career}`);
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Buscar Compañeros
        </h1>
        <p className="text-muted-foreground text-lg italic">Usuarios reales conectados por tus mismos objetivos.</p>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative flex items-center bg-card rounded-2xl p-2 border border-white/5">
          <Search className="ml-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Materia, carrera o nombre..." 
            className="border-0 focus-visible:ring-0 text-md bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch} className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 transition-all">Buscar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse">Buscando en la red de estudiantes...</div>
        ) : results.length > 0 ? (
          results.map((match: any) => (
            <Card key={match.id} className="overflow-hidden border-border/40 bg-secondary/5 hover:border-blue-500/40 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-4">
                  <img src={match.imageUrl} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-500/20" />
                  <div>
                    <h3 className="font-bold text-lg">{match.name}</h3>
                    <p className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> {match.career || "Carrera no definida"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-yellow-500" /> Compatibilidad</span>
                    <span className="text-blue-400">{match.matchPercentage}%</span>
                  </div>
                  <Progress value={match.matchPercentage} className="h-1.5 bg-blue-500/10" />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {match.commonTopics.map((t:string) => (
                    <Badge key={t} variant="secondary" className="text-[9px] bg-blue-500/5 text-blue-300">#{t}</Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2"><MessageSquare className="w-3 h-3" /> Chat</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"><UserPlus className="w-3 h-3 mr-1" /> Conectar</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-24 text-center border-2 border-dashed rounded-3xl opacity-40">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <p>Busca por carrera o materia para encontrar compañeros reales.</p>
          </div>
        )}
      </div>
    </div>
  )
}