"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  User, Mail, Building, BookOpen, Globe, Clock, 
  Edit2, Camera, Plus, X, Save, MapPin, Calendar,
  GraduationCap, Languages, Star
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

const userProfile = {
  name: "Juan Demo",
  email: "juan.demo@universidad.edu",
  university: "Universidad Nacional",
  career: "Ingenieria en Sistemas",
  country: "Mexico",
  timezone: "UTC-6",
  bio: "Estudiante de ultimo ano apasionado por las bases de datos y el desarrollo de software. Busco companeros para estudiar temas avanzados de informatica y practicar ingles tecnico.",
  avatar: "JD",
  level: "Avanzado",
  joinedDate: "Marzo 2024",
  topics: ["Bases de Datos", "Java", "UML", "Algoritmos", "SQL"],
  languages: ["Espanol", "Ingles"],
  schedule: [
    { day: "Lunes", hours: "14:00 - 18:00" },
    { day: "Miercoles", hours: "16:00 - 20:00" },
    { day: "Viernes", hours: "10:00 - 14:00" },
    { day: "Sabado", hours: "09:00 - 13:00" },
  ],
  stats: {
    matches: 12,
    sessions: 28,
    hours: 45,
    rating: 4.8
  }
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(userProfile)
  const [newTopic, setNewTopic] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  const handleAddTopic = () => {
    if (newTopic && !profile.topics.includes(newTopic)) {
      setProfile({ ...profile, topics: [...profile.topics, newTopic] })
      setNewTopic("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setProfile({ ...profile, topics: profile.topics.filter(t => t !== topic) })
  }

  const handleAddLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile({ ...profile, languages: [...profile.languages, newLanguage] })
      setNewLanguage("")
    }
  }

  const handleRemoveLanguage = (lang: string) => {
    setProfile({ ...profile, languages: profile.languages.filter(l => l !== lang) })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu informacion y preferencias
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
          className={isEditing ? "bg-primary hover:bg-primary/90" : ""}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </>
          )}
        </Button>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/20 to-accent/20 relative">
            {isEditing && (
              <button className="absolute right-4 top-4 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <Camera className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
          
          <CardContent className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center border-4 border-card">
                  <span className="text-primary font-bold text-3xl">{profile.avatar}</span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-primary text-primary-foreground">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
              </div>
            </div>

            <div className="pt-14">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="text-2xl font-bold bg-secondary border-border mb-2 w-full max-w-xs"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {profile.university}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Miembro desde {profile.joinedDate}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-0">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    {profile.level}
                  </Badge>
                  <Badge className="bg-accent/10 text-accent border-0">
                    <Star className="w-4 h-4 mr-1" />
                    {profile.stats.rating}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Matches", value: profile.stats.matches, icon: User },
          { label: "Sesiones", value: profile.stats.sessions, icon: Calendar },
          { label: "Horas", value: profile.stats.hours, icon: Clock },
          { label: "Rating", value: profile.stats.rating, icon: Star },
        ].map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bio & Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informacion Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Biografia</Label>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="bg-secondary border-border min-h-[100px]"
                    placeholder="Cuentanos sobre ti..."
                  />
                ) : (
                  <p className="text-foreground">{profile.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p className="text-foreground text-sm">{profile.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Carrera
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profile.career}
                      onChange={(e) => setProfile({ ...profile, career: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  ) : (
                    <p className="text-foreground text-sm">{profile.career}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Zona horaria
                  </Label>
                  {isEditing ? (
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                        <SelectItem value="UTC-6">UTC-6 (CST)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground text-sm">{profile.timezone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Nivel
                  </Label>
                  {isEditing ? (
                    <Select
                      value={profile.level}
                      onValueChange={(value) => setProfile({ ...profile, level: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Principiante">Principiante</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground text-sm">{profile.level}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Topics & Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Topics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Temas de Interes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.topics.map((topic, index) => (
                  <Badge
                    key={index}
                    className="bg-primary/10 text-primary border-0 pr-1"
                  >
                    {topic}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTopic(topic)}
                        className="ml-1 p-0.5 rounded hover:bg-primary/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Agregar tema..."
                    className="bg-secondary border-border"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                  />
                  <Button onClick={handleAddTopic} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="w-5 h-5 text-primary" />
                Idiomas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.languages.map((lang, index) => (
                  <Badge
                    key={index}
                    className="bg-accent/10 text-accent border-0 pr-1"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    {lang}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveLanguage(lang)}
                        className="ml-1 p-0.5 rounded hover:bg-accent/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Select value={newLanguage} onValueChange={setNewLanguage}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Espanol">Espanol</SelectItem>
                      <SelectItem value="Ingles">Ingles</SelectItem>
                      <SelectItem value="Frances">Frances</SelectItem>
                      <SelectItem value="Aleman">Aleman</SelectItem>
                      <SelectItem value="Portugues">Portugues</SelectItem>
                      <SelectItem value="Japones">Japones</SelectItem>
                      <SelectItem value="Chino">Chino</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddLanguage} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Horarios Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.schedule.map((slot, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="font-medium text-foreground mb-1">{slot.day}</div>
                  <div className="text-sm text-muted-foreground">{slot.hours}</div>
                </div>
              ))}
            </div>
            {isEditing && (
              <Button variant="outline" className="mt-4 w-full border-dashed border-border">
                <Plus className="w-4 h-4 mr-2" />
                Agregar horario
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
