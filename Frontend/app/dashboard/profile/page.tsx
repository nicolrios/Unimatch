"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { User, Building, Edit2, Plus, X, Save, GraduationCap } from "lucide-react"
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
        bio: "¡Hola! Estoy configurando mi perfil.",
        topics: ["Programación", "Cálculo"],
      };
    }
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !profile.name) {
      const initialName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "Usuario";
      setProfile(prev => ({ ...prev, name: initialName }));
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSave = async () => {
    try {
      localStorage.setItem('unimatch_profile', JSON.stringify(profile));
      const response = await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
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

      if (response.ok) setIsEditing(false);
      else alert("Error al sincronizar con el servidor");
    } catch (error) {
      alert("Error de conexión. Asegúrate de que el servidor esté activo.");
    }
  };

  if (!isLoaded) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar</>}
        </Button>
      </div>

      <Card className="overflow-hidden bg-card">
        <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <CardContent className="relative -mt-10 flex flex-col sm:flex-row items-end gap-5 px-6 pb-6">
          <img src={user?.imageUrl} className="w-28 h-28 rounded-2xl border-4 border-card shadow-xl object-cover" />
          <div className="flex-1 space-y-2 mb-2">
            {isEditing ? (
              <div className="space-y-2 max-w-md">
                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="text-xl font-bold" />
                <Input value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="text-sm" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <p className="flex items-center gap-1.5 text-primary font-medium"><Building className="w-4 h-4" /> {profile.university}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Información</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="min-h-[100px]" /> : <p className="text-sm leading-relaxed">{profile.bio}</p>}
            <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-xs text-muted-foreground uppercase">Email</Label><p className="text-sm font-medium">{user?.primaryEmailAddress?.emailAddress}</p></div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase">Carrera</Label>
                {isEditing ? <Input value={profile.career} onChange={e => setProfile({...profile, career: e.target.value})} className="h-8" /> : <p className="text-sm font-medium flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary/50" /> {profile.career}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Intereses</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.topics.map((t: string) => (
                <Badge key={t} variant="secondary">{t}{isEditing && <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => setProfile({...profile, topics: profile.topics.filter((i: string) => i !== t)})} />}</Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Nuevo..." className="h-9" />
                <Button size="icon" onClick={() => { if(newTopic) setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); }}><Plus className="w-4 h-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}