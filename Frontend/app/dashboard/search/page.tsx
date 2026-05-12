"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Search, Sparkles, MessageSquare, 
  UserPlus, GraduationCap, BookOpen, 
  Zap, Radar, Orbit
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface MatchUser {
  id: string;
  name: string;
  university: string;
  career: string;
  imageUrl: string;
  commonTopics: string[];
  matchPercentage: number;
}

export default function FuturisticSearch() {
  const { user, isLoaded } = useUser()
  const [results, setResults] = useState<MatchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  const handleSearch = async (isSuggestion = false) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const savedProfile = localStorage.getItem('unimatch_profile');
      const myCareer = savedProfile ? JSON.parse(savedProfile).career : "";

      const url = isSuggestion 
        ? `https://unimatch-backend-vy3b.onrender.com/api/matches/suggestions/${user.id}`
        : `https://unimatch-backend-vy3b.onrender.com/api/matches/search?q=${query}&clerkId=${user.id}&carrera=${myCareer}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) { 
      console.error(e);
      setResults([]);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (isLoaded && user) handleSearch(true); }, [isLoaded, user]);

  if (!isLoaded) return null;

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-1000 relative">
      
      {/* Luces de fondo decorativas */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

      {/* TÍTULO Y SUBTÍTULO */}
      <div className="space-y-3 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Radar className="w-3 h-3 animate-pulse" /> Localizador de Talento Estudiantil
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Explorar <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent italic">Red</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-xl">Descubre compañeros de estudio con afinidad algorítmica.</p>
      </div>

      {/* BUSCADOR FUTURISTA */}
      <div className="relative group max-w-3xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative flex items-center bg-[#05070a] border border-white/10 rounded-2xl p-2 backdrop-blur-xl">
          <Search className="w-6 h-6 ml-4 text-blue-500/50" />
          <Input 
            placeholder="Materia, carrera o palabra clave..." 
            className="border-0 focus-visible:ring-0 bg-transparent text-lg h-14 placeholder:text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
          />
          <Button 
            onClick={() => handleSearch(false)} 
            className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-tighter transition-all"
          >
            Escanear
          </Button>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center space-y-6">
            <Orbit className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-blue-400/50">Procesando Nodos...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((match) => (
            <Card key={match.id} className="group relative bg-[#0a0c14]/80 border-white/5 hover:border-blue-500/40 transition-all duration-500 rounded-[2rem] overflow-hidden backdrop-blur-md">
              {/* Overlay de hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardContent className="p-8 space-y-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    <img src={match.imageUrl} className="h-20 w-20 rounded-2xl object-cover border-2 border-white/5 group-hover:border-blue-500/50 transition-all" alt={match.name} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-xl text-white truncate">{match.name}</h3>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">
                      {match.career || "Core Member"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 text-gray-400"><Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Sincronía</span>
                    <span className="text-blue-400">{match.matchPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000" 
                      style={{ width: `${match.matchPercentage}%` }} 
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {match.commonTopics.map((t) => (
                    <Badge key={t} className="bg-blue-500/5 hover:bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[9px] font-bold px-3 py-1 rounded-lg">
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button variant="ghost" className="rounded-xl border border-white/5 hover:bg-white/5 text-xs font-bold uppercase tracking-tighter">
                    Perfil
                  </Button>
                  <Button className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-tighter shadow-lg shadow-blue-900/20">
                    Conectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
            <p className="text-xs font-black uppercase tracking-[0.4em]">No se detectaron coincidencias</p>
          </div>
        )}
      </div>
    </div>
  )
}