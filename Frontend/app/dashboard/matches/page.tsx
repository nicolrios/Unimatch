"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  Search, Users, Clock, BookOpen, Star, 
  Send, CheckCircle2, MessageSquare, UserPlus 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Definición de la interfaz para usuarios reales
interface MatchUser {
  id: string;
  name: string;
  university: string;
  imageUrl: string;
  commonTopics: string[];
  matchPercentage?: number;
}

export default function MatchesPage() {
  const { user, isLoaded } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestedMatches, setSuggestedMatches] = useState<MatchUser[]>([])
  const [loading, setLoading] = useState(true)
  const [sentRequests, setSentRequests] = useState<string[]>([])

  // Función para obtener sugerencias reales desde el Backend
  const fetchSuggestions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // URL de tu backend en Render
      const response = await fetch(`https://unimatch-nm86mqg53-nicolrios-projects.onrender.com/api/matches/suggestions/${user.id}`);
      const data = await response.json();
      setSuggestedMatches(data);
    } catch (error) {
      console.error("Error al cargar sugerencias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) fetchSuggestions();
  }, [isLoaded, user]);

  // Función para enviar solicitud (Simulación lógica de red en Neo4j)
  const handleSendRequest = async (targetId: string) => {
    // Aquí iría el fetch a tu API de relaciones (:SOLICITUD_ENVIADA)
    setSentRequests([...sentRequests, targetId]);
    console.log(`Solicitud enviada a: ${targetId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">¡Hola, {user?.firstName || "Estudiante"}!</h1>
        <p className="text-muted-foreground">Encontrá personas que estén estudiando lo mismo que vos.</p>
      </div>

      {/* Buscador de compañeros */}
      <div className="flex gap-3 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por materia (ej: calculo)..." 
            className="pl-10 h-12 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="h-12 px-6 bg-primary hover:bg-primary/90">
          Buscar Compañeros
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Matches activos", value: "0", icon: Users },
          { label: "Pendientes", value: "0", icon: Clock },
          { label: "Temas de interés", value: user?.publicMetadata?.topicCount || "2", icon: BookOpen },
          { label: "Sugeridos", value: suggestedMatches.length.toString(), icon: Star },
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
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary/20">
          <TabsTrigger value="activos">Activos (0)</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes (0)</TabsTrigger>
          <TabsTrigger value="sugeridos">Sugeridos ({suggestedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sugeridos" className="mt-6">
          {loading ? (
            <p className="text-center py-10 text-muted-foreground">Buscando compañeros compatibles...</p>
          ) : suggestedMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedMatches.map((match) => (
                <Card key={match.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-14 w-14 rounded-xl">
                        <AvatarImage src={match.imageUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary">{match.name[0]}</AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                        {match.matchPercentage || 85}% Match
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl">{match.name}</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 italic">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" /> {match.university}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-1.5">
                      {match.commonTopics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-[10px] px-2 py-0 bg-secondary/50">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full h-10 gap-2"
                      disabled={sentRequests.includes(match.id)}
                      onClick={() => handleSendRequest(match.id)}
                      variant={sentRequests.includes(match.id) ? "outline" : "default"}
                    >
                      {sentRequests.includes(match.id) ? (
                        <><Send className="w-4 h-4" /> Solicitud Enviada</>
                      ) : (
                        <><UserPlus className="w-4 h-4" /> Enviar Solicitud</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/5 rounded-3xl border-2 border-dashed">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No hay sugerencias todavía</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
                Actualizá tus intereses en el perfil para que podamos recomendarte personas reales.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}