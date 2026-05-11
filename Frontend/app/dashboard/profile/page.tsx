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
  const [newLanguage, setNewLanguage] = useState("")

  // Estado del perfil sin datos de "Juan Demo"
  const [profile, setProfile] = useState({
    university: "Mi Universidad",
    career: "Ingeniería en Sistemas",
    country: "Argentina",
    timezone: "UTC-3",
    bio: "¡Hola! Estoy configurando mi perfil en UniMatch para encontrar compañeros de estudio.",
    level: "Intermedio",
    joinedDate: "2026",
    topics: ["Programación"],
    languages: ["Español"],
    schedule: [
      { day: "Lunes", hours: "18:00 - 20:00" }
    ],
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

  const handleAddLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile({ ...profile, languages: [...profile.languages, newLanguage] })
      setNewLanguage("")
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header con botón de Guardar/Editar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Personaliza tu información real</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <><Save className="w-4 h-4 mr-2" /> Guardar</>
          ) : (
            <><Edit2 className="w-4 h-4 mr-2" /> Editar</>
          )}
        </Button>
      </div>

      {/* Card Principal */}
      <Card className="overflow-hidden border-border bg-card">
        <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        <CardContent className="relative pt-0">
          <div className="absolute -top-12 left-6">
            <div className="relative">
              <img 
                src={user?.imageUrl} 
                className="w-24 h-24 rounded-2xl border-4 border-card object-cover shadow-lg" 
                alt="Avatar"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
            </div>
          </div>

          <div className="pt-16 pb-4">
            <h2 className="text-2xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {profile.university}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.country}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Miembro desde {profile.joinedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Personal */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> Información</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Biografía</Label>
              {isEditing ? (
                <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
              ) : (
                <p className="text-sm">{profile.bio}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div className="space-y-2">
              <Label>Carrera</Label>
              {isEditing ? (
                <Input value={profile.career} onChange={(e) => setProfile({...profile, career: e.target.value})} />
              ) : (
                <p className="text-sm">{profile.career}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Temas */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5" /> Mis Temas</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.topics.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  {t}
                  {isEditing && <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTopic(t)} />}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Nuevo tema..." />
                <Button size="icon" onClick={handleAddTopic}><Plus className="w-4 h-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}