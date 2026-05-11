"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { 
  User, Mail, Building, BookOpen, Globe, Clock, 
  Edit2, Camera, Plus, X, Save, MapPin, Calendar,
  GraduationCap, Star, Languages
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")

  // Datos extendidos del perfil
  const [profile, setProfile] = useState({
    university: "Universidad Nacional",
    career: "Ingeniería en Sistemas",
    country: "Argentina",
    timezone: "UTC-3",
    bio: "¡Hola! Estoy configurando mi perfil para encontrar compañeros de estudio y colaborar en proyectos.",
    level: "Intermedio",
    joinedDate: "2026",
    topics: ["Programación", "Bases de Datos"],
    languages: ["Español"],
    stats: {
      matches: 0,
      sessions: 0,
      hours: 0,
      rating: 5.0
    }
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleAddTopic = () => {
    if (newTopic && !profile.topics.includes(newTopic)) {
      setProfile({ ...profile, topics: [...profile.topics, newTopic] })
      setNewTopic("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setProfile({ ...profile, topics: profile.topics.filter(t => t !== topic) })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4">
      {/* Título de la página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground text-sm">Gestiona tu identidad en UniMatch</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
          className="shadow-sm"
        >
          {isEditing ? (
            <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>
          ) : (
            <><Edit2 className="w-4 h-4 mr-2" /> Editar Perfil</>
          )}
        </Button>
      </div>

      {/* Card de Cabecera Principal */}
      <Card className="overflow-hidden border-border bg-card shadow-md">
        {/* Banner Decorativo */}
        <div className="h-32 bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-teal-500/20" />
        
        <CardContent className="relative pt-0 px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-10">
            {/* Contenedor de la Foto */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl border-4 border-card shadow-xl overflow-hidden bg-secondary">
                <img 
                  src={user?.imageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Tu foto"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card" title="Conectado" />
            </div>

            {/* Contenedor del Nombre y Universidad */}
            <div className="flex-1 mb-2">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : "Usuario UniMatch"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  <Building className="w-4 h-4" /> 
                  {profile.university}
                </span>
                <span className="text-muted-foreground/40 hidden sm:inline">|</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {profile.country}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Información y Bio */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Biografía</Label>
                {isEditing ? (
                  <Textarea 
                    value={profile.bio} 
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="min-h-[120px] bg-secondary/30"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Correo Electrónico</Label>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-primary/60" />
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Carrera Actual</Label>
                  {isEditing ? (
                    <Input 
                      value={profile.career} 
                      onChange={(e) => setProfile({...profile, career: e.target.value})}
                      className="h-9 bg-secondary/30"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <GraduationCap className="w-4 h-4 text-primary/60" />
                      {profile.career}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Temas e Intereses */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Especialidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.topics.map((t) => (
                  <Badge key={t} variant="secondary" className="px-3 py-1 rounded-lg bg-primary/5 text-primary border-primary/10 transition-all">
                    {t}
                    {isEditing && (
                      <X 
                        className="w-3 h-3 ml-2 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveTopic(t)} 
                      />
                    )}
                  </Badge>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Input 
                    value={newTopic} 
                    onChange={(e) => setNewTopic(e.target.value)} 
                    placeholder="Ej: React..." 
                    className="h-9"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                  />
                  <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleAddTopic}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="pt-4 mt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Desde:
                  </span>
                  <span className="font-medium">{profile.joinedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}