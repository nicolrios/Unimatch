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

  // --- NUEVA FUNCIÓN PARA GUARDAR EN EL BACKEND ---
  const handleSave = async () => {
    try {
      // 1. Guardar localmente
      localStorage.setItem('unimatch_profile', JSON.stringify(profile));

      // 2. Enviar al Backend de Render (Neo4j)
      const response = await fetch("https://unimatch-nm86mqg53-nicolrios-projects.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          name: profile.name,
          university: profile.university,
          topics: profile.topics,
          imageUrl: user?.imageUrl
        }),
      });

      if (response.ok) {
        console.log("Perfil sincronizado con Neo4j");
        setIsEditing(false);
      } else {
        alert("Error al sincronizar con el servidor");
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("No se pudo conectar con el servidor de Render");
    }
  };

  if (!isLoaded) return <div className="p-10 text-center">Cargando...</div>;

  const handleAddTopic = () => {
    if (newTopic && !profile.topics.includes(newTopic)) {
      setProfile({ ...profile, topics: [...profile.topics, newTopic] })
      setNewTopic("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setProfile({ ...profile, topics: profile.topics.filter((t: string) => t !== topic) })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground text-sm">Los cambios se guardarán en la base de datos de matches</p>
        </div>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar y Sincronizar</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar Perfil</>}
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
            </div>

            <div className="flex-1 mb-2 space-y-2 w-full">
              {isEditing ? (
                <div className="space-y-3 max-w-md">
                   <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="text-xl font-bold" />
                   <Input value={profile.university} onChange={(e) => setProfile({...profile, university: e.target.value})} className="text-sm" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tight capitalize">{profile.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-primary"><Building className="w-4 h-4" /> {profile.university}</span>
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
            <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-bold">Información</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="min-h-[100px]" /> : <p className="text-sm">{profile.bio}</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-bold text-primary">Temas de Interés</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
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