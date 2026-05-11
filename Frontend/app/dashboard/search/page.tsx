"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Filter, SlidersHorizontal, X, MapPin, 
  Clock, Globe, BookOpen, UserPlus, MessageSquare 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const suggestedTopics = [
  "UML", "Bases de Datos", "Algebra Lineal", "Java", "Fisica", 
  "Calculo", "Python", "Estadistica", "Machine Learning", "Quimica"
]

export default function SearchPage() {
  // --- ESTADOS PARA DATOS REALES ---
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // --- ESTADOS DE FILTROS ---
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [onlineFilter, setOnlineFilter] = useState<string>("all")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // --- LLAMADA A LA API ---
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        // Usamos la URL de tu backend definida en Vercel
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/users`) // Ajusta '/users' según tu endpoint
        
        if (!response.ok) throw new Error("Error al obtener estudiantes")
        
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error("Error en la conexión:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return suggestedTopics
    return suggestedTopics.filter(topic => 
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Filtro de búsqueda (nombre, temas o universidad)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          (student.name?.toLowerCase().includes(query)) ||
          (student.topics?.some((t: string) => t.toLowerCase().includes(query))) ||
          (student.university?.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      
      // Filtro de idioma
      if (languageFilter !== "all" && !student.languages?.includes(languageFilter)) {
        return false
      }
      
      // Filtro de estado online
      if (onlineFilter === "online" && !student.online) return false
      if (onlineFilter === "offline" && student.online) return false
      
      return true
    }).sort((a, b) => (b.match || 0) - (a.match || 0))
  }, [searchQuery, languageFilter, onlineFilter, students])

  const handleSelectTopic = (topic: string) => {
    setSearchQuery(topic)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Buscar compañeros de estudio
        </h1>
        <p className="text-muted-foreground">
          Encuentra estudiantes reales conectados a UniMatch
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por tema, universidad o nombre..."
              className="pl-10 py-6 bg-secondary border-border focus:border-primary text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            
            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground px-2 py-1">Sugerencias</p>
                    {filteredSuggestions.slice(0, 6).map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectTopic(topic)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
                      >
                        <BookOpen className="w-4 h-4 inline-block mr-2 text-primary" />
                        {topic}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button
            variant="outline"
            className="px-4 py-6 border-border"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Idioma
                  </label>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los idiomas</SelectItem>
                      <SelectItem value="Espanol">Español</SelectItem>
                      <SelectItem value="Ingles">Inglés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Estado
                  </label>
                  <Select value={onlineFilter} onValueChange={setOnlineFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="online">En línea ahora</SelectItem>
                      <SelectItem value="offline">Desconectados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => {
                      setLanguageFilter("all")
                      setOnlineFilter("all")
                    }}
                  >
                    <X className="w-4 h-4 mr-2" /> Limpiar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {loading ? "Cargando estudiantes..." : `${filteredStudents.length} estudiantes encontrados`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {student.name?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        {student.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.career}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-accent">{student.match || 0}%</div>
                      <div className="text-xs text-muted-foreground">match</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{student.university}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {student.topics?.map((topic: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      <UserPlus className="w-4 h-4 mr-2" /> Conectar
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {!loading && filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No hay resultados</h3>
            <p className="text-muted-foreground">Prueba con otros temas o filtros.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}