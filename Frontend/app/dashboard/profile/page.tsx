"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  User, Building, Edit2, Plus, X, Save, 
  GraduationCap, BookOpen, ShieldCheck, Cpu
} from "lucide-react"
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

export default function FuturisticProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")

  const [profile, setProfile] = useState<UserProfile>(() => {
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
    return { name: "", university: "", career: "", bio: "", topics: [] };
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !profile.name) {
      const initialName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "Usuario";
      setProfile((prev: UserProfile) => ({ ...prev, name: initialName }));
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
        alert("Error en la conexión de datos.");
      }
    } catch (error) {
      alert("Error crítico: El servidor no responde.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 px-4 animate-in fade-in duration-1000">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.2em] text-[10px]">
            <ShieldCheck className="w-4 h-4" /> Enlace de Datos Activo
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Mi <span className="italic bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">Perfil</span></h1>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Ejecutar Cambios</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar Perfil</>}
        </Button>
      </div>

      <Card className="relative overflow-hidden bg-[#05070a] border-white/5 rounded-[2.5rem]">
        <div className="h-40 bg-gradient-to-b from-blue-900/20 to-transparent" />
        <CardContent className="relative -mt-16 flex flex-col md:flex-row items-center md:items-start gap-8 px-10 pb-10">
          <img src={user?.imageUrl} className="w-40 h-40 rounded-3xl border-2 border-white/10 shadow-2xl object-cover" />
          <div className="flex-1 space-y-4 pt-6 md:pt-16">
            {isEditing ? (
              <div className="space-y-3">
                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-black/40 border-white/10 text-xl font-bold" />
                <Input value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="bg-black/40 border-white/10 text-blue-400" />
              </div>
            ) : (
              <>
                <h2 className="text-5xl font-black tracking-tight text-white">{profile.name}</h2>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase">
                  <Building className="w-3 h-3 mr-2" /> {profile.university}
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#05070a]/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
          <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Cpu className="w-4 h-4" /> Información de Estudiante</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-black/40 border-white/10 rounded-xl" /> : <p className="text-gray-400 italic">"{profile.bio}"</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div><Label className="text-[10px] uppercase text-blue-500/60 font-black">ID Estudiantil</Label><p className="text-sm font-bold text-white">{user?.primaryEmailAddress?.emailAddress}</p></div>
              <div>
                <Label className="text-[10px] uppercase text-blue-500/60 font-black">Especialidad (Carrera)</Label>
                {isEditing ? <Input value={profile.career} onChange={e => setProfile({...profile, career: e.target.value})} className="h-9 bg-black/40 border-white/10" /> : <p className="text-sm font-bold text-white"><GraduationCap className="w-3 h-3 inline mr-1 text-blue-500" /> {profile.career}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#05070a]/60 border-white/5 rounded-[2rem]">
          <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Nodos de Interés</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.topics.map((t: string) => (
                <Badge key={t} className="bg-blue-500/5 text-blue-400 border border-blue-500/20 text-[9px] font-bold">
                  {t} {isEditing && <X className="w-3 h-3 ml-2 cursor-pointer text-red-500" onClick={() => setProfile({...profile, topics: profile.topics.filter(i => i !== t)})} />}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Nuevo nodo..." className="h-9 bg-black/40 border-white/10" />
                <Button size="icon" className="bg-blue-600 h-9 w-9" onClick={() => { if(newTopic) setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); }}><Plus className="w-4 h-4" /></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}