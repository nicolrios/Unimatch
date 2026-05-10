"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Search, Users, MessageSquare, Clock, TrendingUp, 
  BookOpen, Globe, ArrowRight, Sparkles 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const stats = [
  { icon: Users, label: "Matches activos", value: "12", trend: "+3 esta semana" },
  { icon: MessageSquare, label: "Conversaciones", value: "8", trend: "2 sin leer" },
  { icon: BookOpen, label: "Temas seguidos", value: "5", trend: "UML, Java, BD" },
  { icon: Globe, label: "Paises conectados", value: "7", trend: "4 continentes" },
]

const recentMatches = [
  { name: "Maria Garcia", topic: "Calculo III", university: "MIT", match: 95, online: true },
  { name: "John Smith", topic: "Bases de Datos", university: "Stanford", match: 88, online: false },
  { name: "Ana Lopez", topic: "Fisica Cuantica", university: "Cambridge", match: 92, online: true },
  { name: "Carlos Ruiz", topic: "Algoritmos", university: "UNAM", match: 85, online: false },
]

const trendingTopics = [
  { topic: "Machine Learning", students: 1234 },
  { topic: "Bases de Datos", students: 987 },
  { topic: "Calculo Diferencial", students: 856 },
  { topic: "Programacion en Python", students: 765 },
  { topic: "Estadistica", students: 654 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Hola, Juan!
        </h1>
        <p className="text-muted-foreground">
          Encuentra companeros de estudio y mejora tu aprendizaje hoy
        </p>
      </motion.div>

      {/* Quick Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Busqueda rapida</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Escribe un tema: UML, Java, Calculo, Fisica..."
              className="pl-10 py-6 bg-secondary border-border focus:border-primary text-lg"
            />
          </div>
          <Link href="/dashboard/search">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6">
              Buscar matches
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-primary mt-1">{stat.trend}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Matches recientes</CardTitle>
              <Link href="/dashboard/matches">
                <Button variant="ghost" size="sm" className="text-primary">
                  Ver todos
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMatches.map((match, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {match.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      {match.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{match.name}</div>
                      <div className="text-sm text-muted-foreground">{match.university}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {match.topic}
                    </span>
                    <div className="text-sm text-accent font-medium mt-1">{match.match}% match</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Temas en tendencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((item, index) => (
                <Link
                  key={index}
                  href={`/dashboard/search?topic=${encodeURIComponent(item.topic)}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.topic}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.students} estudiantes
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Proximas sesiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">Sesion de Calculo III</div>
                  <div className="text-sm text-muted-foreground">Con Maria Garcia - MIT</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">Hoy, 15:00</div>
                <div className="text-sm text-muted-foreground">En 2 horas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
