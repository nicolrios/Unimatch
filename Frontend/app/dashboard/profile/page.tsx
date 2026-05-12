"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  User, Building, Edit2, Plus, X, Save, 
  GraduationCap, BookOpen, ShieldCheck, Cpu, Sparkles, Zap
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

export default function HyperFuturisticProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [profile, setProfile] = useState<UserProfile>({
    name: "", university: "", career: "", bio: "", topics: []
  });

  // Carga inicial y persistencia
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const saved = localStorage.getItem('unimatch_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        setProfile({
          name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "Estudiante",
          university: "UNdeC",
          career: "Ingeniería en Sistemas",
          bio: "¡Hola! Estoy configurando mi perfil holográfico.",
          topics: ["Programación", "IA", "Cálculo"]
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
        alert("Error de sincronización con la red.");
      }
    } catch (error) {
      alert("Error de conexión: El servidor no responde.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-1000 relative">
      
      {/* Luces de ambiente (Efecto Aurora) */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER DE COMANDO */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">
            <Zap className="w-3 h-3 fill-blue-400" /> System: Profile_Interface_v4.0
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Mi <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">Perfil</span>
          </h1>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 transform hover:scale-105 ${
            isEditing 
            ? "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.5)]" 
            : "bg-white text-black hover:bg-blue-500 hover:text-white shadow-xl"
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar Perfil</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* COLUMNA IZQUIERDA: TARJETA DE IDENTIDAD (AVATAR) */}
        <Card className="bg-black/40 border-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden group">
          <CardContent className="pt-10 flex flex-col items-center text-center space-y-6">
            <div className="relative group cursor-pointer">
              {/* Anillo de carga animado alrededor del avatar */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-20 group-hover:opacity-100 group-hover:animate-spin transition duration-1000"></div>
              <img 
                src={user?.imageUrl} 
                className="relative w-36 h-36 rounded-full border-4 border-[#05070a] object-cover shadow-2xl" 
                alt="Avatar" 
              />
              <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-4 border-[#05070a] shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-2 w-full">
              {isEditing ? (
                <Input 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})} 
                  className="bg-white/5 border-white/10 text-center font-bold rounded-xl"
                />
              ) : (
                <h2 className="text-3xl font-black text-white tracking-tight">{profile.name}</h2>
              )}
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 py-1.5 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Estudiante Activo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* COLUMNA DERECHA: INFORMACIÓN ACADÉMICA (GLASS PANELS) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0a0c14]/60 border-white/5 backdrop-blur-3xl rounded-[2rem] hover:border-blue-500/20 transition-all duration-700">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-blue-500" /> Información de Acceso
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Universidad</Label>
                  {isEditing ? (
                    <Input value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 transition-all" />
                  ) : (
                    <p className="text-white font-bold flex items-center gap-2 group cursor-default">
                      <Building className="w-4 h-4 text-blue-500" /> {profile.university}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Especialidad</Label>
                  {isEditing ? (
                    <Input value={profile.career} onChange={e => setProfile({...profile, career: e.target.value})} className="bg-white/5 border-white/10 rounded-xl" />
                  ) : (
                    <p className="text-white font-bold flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" /> {profile.career}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Biografía de Usuario</Label>
                {isEditing ? (
                  <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-white/5 border-white/10 rounded-2xl min-h-[100px] transition-all" />
                ) : (
                  <p className="text-gray-400 text-sm leading-relaxed font-medium italic">"{profile.bio}"</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* NODOS DE CONOCIMIENTO (TAGS ANIMADOS) */}
          <Card className="bg-[#0a0c14]/60 border-white/5 backdrop-blur-3xl rounded-[2rem] group hover:border-indigo-500/20 transition-all duration-700">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Nodos de Conocimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-wrap gap-3">
                {profile.topics.map((t) => (
                  <Badge 
                    key={t} 
                    className="bg-indigo-600/10 text-indigo-300 border border-indigo-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all cursor-default"
                  >
                    {t}
                    {isEditing && (
                      <X className="w-3.5 h-3.5 ml-3 cursor-pointer text-red-500 hover:text-white" onClick={() => setProfile({...profile, topics: profile.topics.filter(i => i !== t)})} />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2 pt-4 animate-in slide-in-from-left duration-500">
                  <Input 
                    value={newTopic} 
                    onChange={e => setNewTopic(e.target.value)} 
                    placeholder="Agregar nuevo nodo..." 
                    className="bg-white/5 border-white/10 rounded-xl h-11"
                    onKeyDown={e => { if(e.key === 'Enter' && newTopic) { setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); } }}
                  />
                  <Button onClick={() => { if(newTopic) { setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); } }} size="icon" className="bg-indigo-600 h-11 w-11 rounded-xl">
                    <Plus className="w-5 h-5" />
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