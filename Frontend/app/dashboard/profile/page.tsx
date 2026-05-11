"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  User, Mail, Building, BookOpen, Edit2, Plus, X, Save, MapPin, GraduationCap 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")

  // Estado del perfil con persistencia
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unimatch_profile');
      return saved ? JSON.parse(saved) : {
        name: "",
        university: "Universidad Nacional",
        career: "Ingeniería en Sistemas",
        country: "Argentina",
        bio: "¡Hola! Estoy configurando mi perfil.",
        joinedDate: "2026",
        topics: ["Programación", "Cálculo"],
      };
    }
    return { name: "", university: "", career: "", country: "", bio: "", joinedDate: "2026", topics: [] };
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !profile.name) {
      const initialName = user.firstName 
        ? `${user.firstName} ${user.lastName || ""}` 
        : user.primaryEmailAddress?.emailAddress.split('@')[0] || "Usuario";
      
      const newProfile = { ...profile, name: initialName };
      setProfile(newProfile);
      localStorage.setItem('unimatch_profile', JSON.stringify(newProfile));
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSave = () => {
    localStorage.setItem('unimatch_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleAddTopic = () => {
    if (newTopic && !profile.topics.includes(newTopic)) {
      setProfile({ ...profile, topics: [...profile.topics, newTopic] })
      setNewTopic("")
    }
  }

  // Se añade el tipo ': string' para corregir el error de TypeScript
  const handleRemoveTopic = (topic: string) => {
    setProfile({ ...profile, topics: profile.topics.filter((t: string) => t !== topic) })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground text-sm">Tus datos se guardan en este navegador</p>
        </div>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>
          ) : (
            <><Edit2 className="w-4 h-4 mr-2" /> Editar Perfil</>
          )}
        </Button>
      </div>

      <Card className="overflow-hidden border-border bg-card shadow-md">
        <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <CardContent className="relative pt-0 px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-10">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl border-4 border-card shadow-xl overflow-hidden bg-secondary">
                <img src={user?.imageUrl} className="w-full h-full object-cover" alt="Perfil" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card" />
            </div>

            <div className="flex-1 mb-2 space-y-2 w-full">
              {isEditing ? (
                <div className="space-y-3 max-w-md">
                   <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-primary">Nombre Completo</Label>
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="text-xl font-bold bg-secondary/40 h-10"
                    />
                   </div>
                   <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-primary">Universidad</Label>
                    <Input 
                      value={profile.university} 
                      onChange={(e) => setProfile({...profile, university: e.target.value})}
                      className="text-sm bg-secondary/40 h-9"
                    />
                   </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tight capitalize">{profile.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-primary"><Building className="w-4 h-4" /> {profile.university}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.country}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Bio</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="bg-secondary/10 min-h-[100px]" />
              ) : (
                <p className="text-sm leading-relaxed">{profile.bio}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground uppercase">Email</Label>
                  <p className="text-sm font-medium flex items-center gap-2"><Mail className="w-4 h-4 text-primary/50" /> {user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground uppercase">Carrera</Label>
                  {isEditing ? (
                    <Input value={profile.career} onChange={(e) => setProfile({...profile, career: e.target.value})} className="h-8" />
                  ) : (
                    <p className="text-sm font-medium flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary/50" /> {profile.career}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Temas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {/* Se añade el tipo ': string' para corregir el segundo error */}
              {profile.topics.map((t: string) => (
                <Badge key={t} variant="secondary">
                  {t}
                  {isEditing && <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => handleRemoveTopic(t)} />}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Nuevo..." className="h-9" />
                <Button size="icon" className="h-9 w-9" onClick={handleAddTopic}><Plus className="w-4 h-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}