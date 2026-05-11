"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Search, UserPlus, BookOpen, Building, MessageCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Tipo para definir a un usuario real
interface MatchUser {
  id: string;
  name: string;
  university: string;
  career: string;
  imageUrl: string;
  commonTopics: string[];
}

export default function SearchPage() {
  const { user, isLoaded } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [matches, setMatches] = useState<MatchUser[]>([])
  const [loading, setLoading] = useState(true)

  // Función para obtener matches reales desde tu Backend de Render
  const fetchMatches = async () => {
    setLoading(true)
    try {
      // Reemplaza con tu URL real de Render cuando la tengas lista
      // const response = await fetch(`https://tu-backend.onrender.com/api/matches/${user?.id}`);
      // const data = await response.json();
      
      // MOCK TEMPORAL: Para que veas cómo se verá cuando haya otros usuarios
      // En cuanto otro usuario se registre, esta lista vendrá de la base de datos Neo4j
      setMatches([]) 
    } catch (error) {
      console.error("Error al buscar usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchMatches()
    }
  }, [isLoaded, user])

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Buscar Compañeros</h1>
        <p className="text-muted-foreground">Encuentra estudiantes con tus mismos intereses y materias.</p>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por materia (ej: Cálculo, Álgebra, Programación...)" 
            className="pl-10 h-12 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="h-12 px-6">
          <Filter className="w-4 h-4 mr-2" /> Filtrar
        </Button>
      </div>

      {/* Resultados y Sugerencias */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" /> 
          {searchQuery ? `Resultados para "${searchQuery}"` : "Sugerencias basadas en tu perfil"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-xl border-2 border-background shadow-sm">
                    <AvatarImage src={match.imageUrl} />
                    <AvatarFallback>{match.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{match.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="w-3 h-3" /> {match.university}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.commonTopics.map(topic => (
                        <Badge key={topic} variant="secondary" className="text-[10px] py-0">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-border">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
              <BookOpen className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">No hay usuarios reales todavía</h3>
            <p className="text-muted-foreground text-sm max-w-xs text-center mt-2">
              Para que aparezcan personas aquí, otros estudiantes deben registrarse y elegir tus mismos temas.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
              Actualizar lista
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}