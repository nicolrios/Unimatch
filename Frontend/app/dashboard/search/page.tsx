"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Search, Sparkles, MessageSquare, UserPlus, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SearchPage() {
  const { user, isLoaded } = useUser()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  const handleSearch = async (isSuggestion = false) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const url = isSuggestion 
        ? `https://unimatch-backend-vy3b.onrender.com/api/matches/suggestions/${user.id}`
        : `https://unimatch-backend-vy3b.onrender.com/api/matches/search?q=${query}&clerkId=${user.id}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (isLoaded && user) handleSearch(true); }, [isLoaded, user]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Compañeros Reales
        </h1>
        <p className="text-muted-foreground italic">Encontrados por intereses comunes como {query || 'UML'}.</p>
      </div>

      <div className="flex gap-2 max-w-2xl bg-card p-1.5 rounded-2xl border border-white/10 shadow-2xl">
        <Input 
          placeholder="Buscar materia o carrera..." 
          className="border-0 focus-visible:ring-0 bg-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => handleSearch(false)} className="rounded-xl bg-blue-600 hover:bg-blue-700">Buscar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse font-medium">
            Escaneando la red UniMatch...
          </div>
        ) : results.length > 0 ? (
          results.map((match: any) => (
            <Card key={match.id} className="group border-white/5 bg-secondary/5 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={match.imageUrl} className="h-14 w-14 rounded-2xl object-cover border-2 border-blue-500/20" />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{match.name}</h3>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{match.career || "Estudiante"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-yellow-500" /> Afinidad</span>
                    <span className="text-blue-400">{match.matchPercentage}%</span>
                  </div>
                  <Progress value={match.matchPercentage} className="h-1.5 bg-blue-500/10" />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {match.commonTopics.map((t: string) => (
                    <Badge key={t} variant="secondary" className="text-[9px] bg-blue-500/10 text-blue-200 border-none">
                      <BookOpen className="w-2 h-2 mr-1" /> {t}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="hover:bg-blue-500/10 border-white/10">Chat</Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Conectar</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-muted-foreground">No hay coincidencias exactas todavía. ¡Invita a más compañeros!</p>
          </div>
        )}
      </div>
    </div>
  )
}