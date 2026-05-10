"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, Clock, Globe, BookOpen, MessageSquare, 
  Calendar, Star, MoreHorizontal, Check, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const activeMatches = [
  {
    id: 1,
    name: "Maria Garcia",
    university: "MIT",
    topics: ["Calculo III", "Algebra Lineal"],
    commonTopics: 2,
    compatibleSchedule: true,
    match: 95,
    online: true,
    lastMessage: "Nos vemos manana a las 3pm!",
    lastActive: "Hace 5 min",
    avatar: "MG"
  },
  {
    id: 2,
    name: "John Smith",
    university: "Stanford",
    topics: ["Bases de Datos", "SQL"],
    commonTopics: 3,
    compatibleSchedule: true,
    match: 88,
    online: true,
    lastMessage: "El ejercicio 5 esta complicado",
    lastActive: "Hace 20 min",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Ana Lopez",
    university: "Cambridge",
    topics: ["Fisica Cuantica"],
    commonTopics: 1,
    compatibleSchedule: false,
    match: 92,
    online: false,
    lastMessage: "Gracias por la explicacion!",
    lastActive: "Hace 2 horas",
    avatar: "AL"
  },
]

const pendingMatches = [
  {
    id: 4,
    name: "Carlos Ruiz",
    university: "UNAM",
    topics: ["Algoritmos", "Java"],
    match: 85,
    online: true,
    requestedAt: "Hace 1 hora",
    avatar: "CR"
  },
  {
    id: 5,
    name: "Emma Schmidt",
    university: "TU Munich",
    topics: ["UML", "Software Engineering"],
    match: 91,
    online: false,
    requestedAt: "Hace 3 horas",
    avatar: "ES"
  },
]

const suggestedMatches = [
  {
    id: 6,
    name: "Yuki Tanaka",
    university: "Universidad de Tokio",
    topics: ["Algebra Lineal", "Calculo"],
    match: 78,
    online: false,
    reason: "Estudia los mismos temas que tu",
    avatar: "YT"
  },
  {
    id: 7,
    name: "Pierre Dubois",
    university: "Sorbonne",
    topics: ["Estadistica", "Probabilidad"],
    match: 82,
    online: true,
    reason: "Horario compatible contigo",
    avatar: "PD"
  },
  {
    id: 8,
    name: "Sofia Martinez",
    university: "UBA",
    topics: ["Python", "Machine Learning"],
    match: 75,
    online: true,
    reason: "Habla tu mismo idioma",
    avatar: "SM"
  },
]

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Mis Matches
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus conexiones y encuentra nuevos companeros de estudio
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Users, label: "Matches activos", value: activeMatches.length },
          { icon: Clock, label: "Pendientes", value: pendingMatches.length },
          { icon: BookOpen, label: "Temas en comun", value: 8 },
          { icon: Star, label: "Favoritos", value: 3 },
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
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Activos ({activeMatches.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Pendientes ({pendingMatches.length})
            </TabsTrigger>
            <TabsTrigger value="suggested" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sugeridos
            </TabsTrigger>
          </TabsList>

          {/* Active Matches */}
          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {activeMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-bold text-lg">{match.avatar}</span>
                            </div>
                            {match.online && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{match.name}</h3>
                              <span className="text-accent font-medium text-sm">{match.match}% match</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{match.university}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {match.topics.map((topic, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex flex-col sm:items-end gap-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {match.commonTopics} temas
                            </div>
                            {match.compatibleSchedule && (
                              <div className="flex items-center gap-1 text-green-500">
                                <Clock className="w-4 h-4" />
                                Horario compatible
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            &ldquo;{match.lastMessage}&rdquo;
                          </p>
                          <div className="flex items-center gap-2">
                            <Link href="/dashboard/chat">
                              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Mensaje
                              </Button>
                            </Link>
                            <Button variant="outline" className="border-border">
                              <Calendar className="w-4 h-4 mr-2" />
                              Agendar
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                                <DropdownMenuItem>Agregar a favoritos</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Eliminar match</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Pending Matches */}
          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {pendingMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-card border-border border-l-4 border-l-primary">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-bold text-lg">{match.avatar}</span>
                            </div>
                            {match.online && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{match.name}</h3>
                              <span className="text-accent font-medium text-sm">{match.match}% match</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{match.university}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {match.topics.map((topic, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Solicitud enviada {match.requestedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <Check className="w-4 h-4 mr-2" />
                            Aceptar
                          </Button>
                          <Button variant="outline" className="border-border text-destructive hover:text-destructive">
                            <X className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Suggested Matches */}
          <TabsContent value="suggested" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-card border-border hover:border-primary/30 transition-colors h-full">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">{match.avatar}</span>
                          </div>
                          {match.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{match.name}</h3>
                          <p className="text-sm text-muted-foreground">{match.university}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-accent">{match.match}%</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {match.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent" />
                        {match.reason}
                      </p>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        Conectar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
