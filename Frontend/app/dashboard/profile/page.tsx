"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { User, Building, Edit2, Plus, X, Save, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  name: string;
  university: string;
  career: string;
  bio: string;
  topics: string[];
}

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    university: "",
    career: "",
    bio: "",
    topics: []
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const saved = localStorage.getItem('unimatch_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        setProfile({
          name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "",
          university: "Universidad Nacional",
          career: "Ingeniería en Sistemas",
          bio: "¡Hola! Estoy usando UniMatch.",
          topics: ["Programación"]
        });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSave = async () => {
    try {
      const response = await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          name: profile.name,
          university: profile.university,
          topics: profile.topics,
          imageUrl: user?.imageUrl,
          career: profile.career
        }),
      });

      if (response.ok) {
        localStorage.setItem('unimatch_profile', JSON.stringify(profile));
        setIsEditing(false);
      } else {
        alert("Error al sincronizar con el servidor.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red: Verifica que el servidor en Render esté encendido.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER SIMPLE Y MODERNO */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Mi Perfil</h1>
          <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mt-1">Gestión de Nodo de Usuario</p>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="rounded-xl font-bold uppercase text-xs px-6 bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: AVATAR Y DATOS BÁSICOS */}
        <Card className="md:col-span-1 bg-[#0a0c14] border-white/5 rounded-3xl overflow-hidden">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600">
              <img src={user?.imageUrl} className="w-32 h-32 rounded-full border-4 border-[#0a0c14] object-cover" alt="Perfil" />
            </div>
            <div className="space-y-1">
              {isEditing ? (
                <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="text-center bg-white/5 border-white/10" />
              ) : (
                <h2 className="text-xl font-black text-white">{profile.name}</h2>
              )}
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/5 uppercase text-[10px]">
                Estudiante Activo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* COLUMNA DERECHA: INFORMACIÓN DETALLADA */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0a0c14] border-white/5 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-500" /> Información Académica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-400">Universidad</Label>
                  {isEditing ? (
                    <Input value={profile.university} onChange={(e) => setProfile({...profile, university: e.target.value})} className="bg-white/5 border-white/10" />
                  ) : (
                    <p className="text-white font-medium">{profile.university}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-400">Carrera</Label>
                  {isEditing ? (
                    <Input value={profile.career} onChange={(e) => setProfile({...profile, career: e.target.value})} className="bg-white/5 border-white/10" />
                  ) : (
                    <p className="text-white font-medium">{profile.career}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Label className="text-xs font-bold text-gray-400">Biografía</Label>
                {isEditing ? (
                  <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="bg-white/5 border-white/10" />
                ) : (
                  <p className="text-gray-400 text-sm leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* TEMAS DE INTERÉS */}
          <Card className="bg-[#0a0c14] border-white/5 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> Nodos de Conocimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.topics.map((t) => (
                  <Badge key={t} className="bg-blue-600/10 text-blue-400 border-blue-600/20 px-3 py-1 rounded-lg font-bold">
                    {t}
                    {isEditing && (
                      <X className="w-3 h-3 ml-2 cursor-pointer hover:text-white" onClick={() => setProfile({...profile, topics: profile.topics.filter(i => i !== t)})} />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Input 
                    value={newTopic} 
                    onChange={(e) => setNewTopic(e.target.value)} 
                    placeholder="Nuevo tema..." 
                    className="bg-white/5 border-white/10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTopic) {
                        setProfile({...profile, topics: [...profile.topics, newTopic]});
                        setNewTopic("");
                      }
                    }}
                  />
                  <Button onClick={() => { if(newTopic) setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); }} size="icon" className="bg-blue-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}