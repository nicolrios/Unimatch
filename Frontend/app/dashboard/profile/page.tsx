"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { 
  User, Building, Edit2, Plus, X, Save, 
  GraduationCap, BookOpen, ShieldCheck, Cpu, Globe
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
      localStorage.setItem('unimatch_profile', JSON.stringify(profile));
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

      if (response.ok) setIsEditing(false);
      else alert("Error en el enlace de datos");
    } catch (error) {
      alert("Error de conexión con la red central.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 px-4 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* HEADER DE ACCESO */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">
            <ShieldCheck className="w-4 h-4" /> Perfil Verificado UniMatch
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">Mi <span className="italic bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">Perfil</span></h1>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
            isEditing 
            ? "bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(22,163,74,0.4)]" 
            : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Ejecutar Cambios</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar Datos</>}
        </Button>
      </div>

      {/* TARJETA PRINCIPAL (AVATAR Y HERO) */}
      <Card className="relative overflow-hidden bg-[#05070a] border-white/5 rounded-[2.5rem] shadow-2xl">
        <div className="h-48 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-50" />
        <CardContent className="relative -mt-16 flex flex-col items-center md:items-start md:flex-row gap-8 px-10 pb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <img 
              src={user?.imageUrl} 
              className="relative w-40 h-40 rounded-3xl border-2 border-white/10 shadow-2xl object-cover transform transition-transform group-hover:scale-[1.02]" 
              alt="Avatar"
            />
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left pt-6 md:pt-16">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-black/40 border-white/10 text-2xl font-black h-14 rounded-2xl" />
                <Input value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="bg-black/40 border-white/10 text-blue-400 rounded-xl" />
              </div>
            ) : (
              <>
                <h2 className="text-5xl font-black tracking-tight text-white">{profile.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Building className="w-3 h-3 mr-2" /> {profile.university}
                  </Badge>
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Globe className="w-3 h-3 mr-2" /> Nivel 1 Estudiante
                  </Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIONES DE INFORMACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INFO Y BIO */}
        <Card className="lg:col-span-2 bg-[#05070a]/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-gray-400">
              <Cpu className="w-5 h-5 text-blue-500" />Información del estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isEditing ? (
              <Textarea 
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})} 
                className="min-h-[120px] bg-black/40 border-white/10 rounded-2xl p-4 focus:border-blue-500/50" 
              />
            ) : (
              <p className="text-gray-400 leading-relaxed font-medium italic">"{profile.bio}"</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">ID Estudiantil</Label>
                <p className="text-white font-bold">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">Especialidad (Carrera)</Label>
                {isEditing ? (
                  <Input value={profile.career} onChange={e => setProfile({...profile, career: e.target.value})} className="bg-black/40 border-white/10 h-10 rounded-xl" />
                ) : (
                  <p className="text-white font-bold flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" /> {profile.career}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NODOS DE INTERÉS */}
        <Card className="bg-[#05070a]/60 border-white/5 backdrop-blur-xl rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-10 -mt-10" />
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-gray-400">
              <BookOpen className="w-5 h-5 text-blue-500" />Temas de interés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="flex flex-wrap gap-2">
              {profile.topics.map((t: string) => (
                <Badge key={t} className="bg-blue-500/5 text-blue-400 border border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase hover:bg-blue-500 hover:text-white transition-colors cursor-default">
                  {t}
                  {isEditing && (
                    <X className="w-3 h-3 ml-2 cursor-pointer text-red-400" onClick={() => setProfile({...profile, topics: profile.topics.filter((i: string) => i !== t)})} />
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Input 
                  value={newTopic} 
                  onChange={e => setNewTopic(e.target.value)} 
                  placeholder="Agregar nodo..." 
                  className="bg-black/40 border-white/10 h-10 rounded-xl placeholder:text-gray-700" 
                />
                <Button size="icon" className="bg-blue-600 rounded-xl h-10 w-10" onClick={() => { if(newTopic) setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}