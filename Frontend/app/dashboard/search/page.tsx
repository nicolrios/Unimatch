"use client"

import { useState, useMemo } from "react"
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

const mockStudents = [
  {
    id: 1,
    name: "Maria Garcia",
    university: "MIT",
    career: "Computer Science",
    country: "Estados Unidos",
    topics: ["Bases de Datos", "SQL", "NoSQL"],
    languages: ["Espanol", "Ingles"],
    match: 95,
    online: true,
    timezone: "UTC-5",
    avatar: "MG"
  },
  {
    id: 2,
    name: "John Smith",
    university: "Stanford University",
    career: "Data Science",
    country: "Estados Unidos",
    topics: ["Machine Learning", "Python", "Estadistica"],
    languages: ["Ingles"],
    match: 88,
    online: true,
    timezone: "UTC-8",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Ana Lopez",
    university: "Universidad de Cambridge",
    career: "Fisica",
    country: "Reino Unido",
    topics: ["Fisica Cuantica", "Calculo", "Algebra"],
    languages: ["Espanol", "Ingles", "Frances"],
    match: 92,
    online: false,
    timezone: "UTC+0",
    avatar: "AL"
  },
  {
    id: 4,
    name: "Carlos Ruiz",
    university: "UNAM",
    career: "Ingenieria en Sistemas",
    country: "Mexico",
    topics: ["Algoritmos", "Java", "Estructuras de Datos"],
    languages: ["Espanol"],
    match: 85,
    online: true,
    timezone: "UTC-6",
    avatar: "CR"
  },
  {
    id: 5,
    name: "Yuki Tanaka",
    university: "Universidad de Tokio",
    career: "Matematicas",
    country: "Japon",
    topics: ["Algebra Lineal", "Calculo", "Teoria de Numeros"],
    languages: ["Japones", "Ingles"],
    match: 78,
    online: false,
    timezone: "UTC+9",
    avatar: "YT"
  },
  {
    id: 6,
    name: "Emma Schmidt",
    university: "TU Munich",
    career: "Ingenieria",
    country: "Alemania",
    topics: ["UML", "Bases de Datos", "Software Engineering"],
    languages: ["Aleman", "Ingles"],
    match: 91,
    online: true,
    timezone: "UTC+1",
    avatar: "ES"
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [timezoneFilter, setTimezoneFilter] = useState<string>("all")
  const [onlineFilter, setOnlineFilter] = useState<string>("all")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return suggestedTopics
    return suggestedTopics.filter(topic => 
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(student => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          student.name.toLowerCase().includes(query) ||
          student.topics.some(t => t.toLowerCase().includes(query)) ||
          student.university.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      // Language filter
      if (languageFilter !== "all" && !student.languages.includes(languageFilter)) {
        return false
      }
      
      // Online filter
      if (onlineFilter === "online" && !student.online) return false
      if (onlineFilter === "offline" && student.online) return false
      
      return true
    }).sort((a, b) => b.match - a.match)
  }, [searchQuery, languageFilter, onlineFilter])

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
          Buscar companeros de estudio
        </h1>
        <p className="text-muted-foreground">
          Encuentra estudiantes que esten estudiando los mismos temas que tu
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
              placeholder="Escribe un tema: UML, Java, Calculo, Fisica..."
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
            {(languageFilter !== "all" || onlineFilter !== "all") && (
              <Badge className="ml-2 bg-primary text-primary-foreground">
                {[languageFilter !== "all", onlineFilter !== "all"].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters */}
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
                    <Globe className="w-4 h-4" />
                    Idioma
                  </label>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Todos los idiomas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los idiomas</SelectItem>
                      <SelectItem value="Espanol">Espanol</SelectItem>
                      <SelectItem value="Ingles">Ingles</SelectItem>
                      <SelectItem value="Frances">Frances</SelectItem>
                      <SelectItem value="Aleman">Aleman</SelectItem>
                      <SelectItem value="Japones">Japones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Disponibilidad
                  </label>
                  <Select value={onlineFilter} onValueChange={setOnlineFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="online">En linea ahora</SelectItem>
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
                      setTimezoneFilter("all")
                      setOnlineFilter("all")
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular Topics */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">Populares:</span>
          {suggestedTopics.slice(0, 5).map((topic, index) => (
            <button
              key={index}
              onClick={() => handleSelectTopic(topic)}
              className="px-3 py-1 rounded-full bg-secondary text-sm text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredStudents.length} estudiantes encontrados
          </h2>
          <Select defaultValue="match">
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Mayor match</SelectItem>
              <SelectItem value="recent">Mas reciente</SelectItem>
              <SelectItem value="online">En linea primero</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-bold">{student.avatar}</span>
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
                      <div className="text-lg font-bold text-accent">{student.match}%</div>
                      <div className="text-xs text-muted-foreground">match</div>
                    </div>
                  </div>

                  {/* University & Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{student.university}</span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {student.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Languages & Timezone */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      {student.languages.join(", ")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {student.timezone}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Conectar
                    </Button>
                    <Button variant="outline" size="icon" className="border-border">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron estudiantes
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros terminos de busqueda o ajusta los filtros
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
