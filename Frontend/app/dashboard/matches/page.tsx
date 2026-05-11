"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, Clock, BookOpen, MessageSquare, 
  Calendar, Star, MoreHorizontal, Check, X, Search, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

// --- ESTA ES LA PARTE QUE AGREGAMOS (EL MOLDE) ---
interface Match {
  id: number;
  name: string;
  university: string;
  topics: string[];
  commonTopics: number;
  compatibleSchedule: boolean;
  match: number;
  online: boolean;
  lastMessage: string;
  avatar: string;
}

export default function MatchesPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  
  // --- CORREGIMOS LOS ESTADOS AGREGANDO <Match[]> ---
  const [activeMatches, setActiveMatches] = useState<Match[]>([])
  const [pendingMatches, setPendingMatches] = useState<Match[]>([])
  const [suggestedMatches, setSuggestedMatches] = useState<Match[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)

    setTimeout(() => {
      // Este es el "nuevo compañero" que aparece al buscar
      const mockResult: Match = {
        id: Math.random(),
        name: "Nuevo Compañero",
        university: "Universidad Compatible",
        topics: [searchQuery, "Estudio General"],
        commonTopics: 1,
        compatibleSchedule: true,
        match: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
        online: true,
        lastMessage: "¡Hola! Vi que buscas " + searchQuery,
        avatar: "NC"
      }
      
      setSuggestedMatches([mockResult])
      setIsSearching(false)
      setActiveTab("suggested")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          ¡Hola, {user?.firstName || "Estudiante"}!
        </h1>
        <p className="text-muted-foreground">
          Encontrá personas que estén estudiando lo mismo que vos.
        </p>
      </motion.div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué tema querés estudiar hoy? (ej: Calculo, SQL...)"
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all text-foreground"
              />
            </div>
            <Button type="submit" disabled={isSearching} className="bg-primary hover:bg-primary/90 text-white px-8">
              {isSearching ? "Buscando..." : "Buscar Compañeros"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Matches activos", value: activeMatches.length },
          { icon: Clock, label: "Pendientes", value: pendingMatches.length },
          { icon: BookOpen, label: "Temas de interés", value: searchQuery ? 1 : 0 },
          { icon: Star, label: "Sugeridos", value: suggestedMatches.length },
        ].map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="active">Activos ({activeMatches.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pendingMatches.length})</TabsTrigger>
          <TabsTrigger value="suggested">Sugeridos ({suggestedMatches.length})</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="active" className="mt-6">
            {activeMatches.length === 0 ? (
              <EmptyState 
                title="Sin matches activos" 
                desc="Todavía no aceptaste ninguna conexión. ¡Buscá temas arriba para empezar!" 
              />
            ) : (
              <div className="space-y-4">
                {/* Mapeo de matches activos */}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingMatches.length === 0 ? (
              <EmptyState 
                title="Sin solicitudes" 
                desc="No tienes solicitudes de match pendientes en este momento." 
              />
            ) : (
              <div className="space-y-4">
                {/* Mapeo de matches pendientes */}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggested" className="mt-6">
            {suggestedMatches.length === 0 ? (
              <EmptyState 
                title="Buscá un compañero" 
                desc="Escribí un tema en el buscador para que la IA de UniMatch te encuentre compañeros." 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedMatches.map((match) => (
                  <motion.div key={match.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="bg-card border-primary/30 border-2">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {match.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{match.name}</h3>
                            <p className="text-xs text-muted-foreground">{match.university}</p>
                          </div>
                          <div className="ml-auto text-primary font-bold">{match.match}%</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {match.topics.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">{t}</span>
                          ))}
                        </div>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90">
                          Enviar Solicitud
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

function EmptyState({ title, desc }: { title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-3xl"
    >
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-1 text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-xs">{desc}</p>
    </motion.div>
  )
}