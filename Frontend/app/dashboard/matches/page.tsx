"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Search, Users, Clock, BookOpen, Star, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interfaz definida fuera del componente para mayor estabilidad
interface MatchUser {
  id: string;
  name: string;
  university: string;
  imageUrl: string;
  commonTopics: string[];
}

export default function MatchesPage() {
  const { user, isLoaded } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [matches, setMatches] = useState<MatchUser[]>([])
  const [loading, setLoading] = useState(true)
  const [topicCount, setTopicCount] = useState(0)
  const [sentRequests, setSentRequests] = useState<string[]>([])

  // Función para obtener sugerencias
  const fetchSuggestions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/suggestions/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error fetching suggestions:", e);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar por materia
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchSuggestions();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/search?q=${searchQuery}&clerkId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error in search:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unimatch_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTopicCount(parsed.topics?.length || 0);
      }
    }
    if (isLoaded && user) {
      fetchSuggestions();
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">¡Hola, {user?.firstName || "Estudiante"}!</h1>
      
      <div className="flex gap-3 max-w-2xl">
        <Input 
          placeholder="Buscar materia..." 
          className="bg-card h-12" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button className="h-12 px-6" onClick={handleSearch}>Buscar Compañeros</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Matches activos", value: "0", icon: Users },
          { label: "Pendientes", value: "0", icon: Clock },
          { label: "Temas de interés", value: String(topicCount), icon: BookOpen },
          { label: "Sugeridos", value: String(matches.length), icon: Star },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sugeridos" className="w-full">
        <TabsList className="bg-secondary/20">
          <TabsTrigger value="sugeridos">Sugeridos ({matches.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="sugeridos" className="mt-6">
          {loading ? (
            <p className="text-center py-10 text-muted-foreground">Buscando compañeros compatibles...</p>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <Card key={match.id} className="border-border/50 hover:border-primary/30 transition-all">
                  <CardHeader>
                    <Avatar className="h-14 w-14 rounded-xl">
                      <AvatarImage src={match.imageUrl} />
                      <AvatarFallback>{match.name ? match.name[0] : 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4">{match.name}</CardTitle>
                    <p className="text-xs text-muted-foreground italic">{match.university}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {match.commonTopics?.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={sentRequests.includes(match.id) ? "outline" : "default"}
                      onClick={() => setSentRequests([...sentRequests, match.id])}
                      disabled={sentRequests.includes(match.id)}
                    >
                      {sentRequests.includes(match.id) ? "Solicitud Enviada" : "Enviar Solicitud"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/5 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground">No se encontraron compañeros. Intentá con otros temas.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}