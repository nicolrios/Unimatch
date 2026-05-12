"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Edit2, Save, Plus, X, Zap, Cpu, GraduationCap, BookOpen, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function FuturisticProfile() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [profile, setProfile] = useState({
    name: "", university: "", career: "", bio: "", topics: [] as string[]
  })

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const saved = localStorage.getItem('unimatch_profile')
      if (saved) setProfile(JSON.parse(saved))
      else setProfile({
        name: user.fullName || "Usuario", university: "UNdeC", 
        career: "Ingeniería en Sistemas", bio: "Iniciando protocolo...", topics: ["Sistemas"]
      })
    }
  }, [isLoaded, isSignedIn, user])

  const handleSave = async () => {
    try {
      const dataToSend = {
        clerkId: user?.id,
        name: profile.name,
        university: profile.university,
        topics: profile.topics,
        imageUrl: user?.imageUrl,
        career: profile.career
      };
  
      console.log("Enviando datos al servidor:", dataToSend);
  
      const response = await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Guardar también en local para que el cambio sea instantáneo al recargar
        localStorage.setItem('unimatch_profile', JSON.stringify(profile));
        setIsEditing(false);
        alert("✅ Datos guardados correctamente.");
      } else {
        alert(`❌ Error del servidor: ${result.error}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("❌ No se pudo conectar con el servidor de Render. Revisa que esté encendido.");
    }
  };

  if (!isLoaded) return null

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 relative animate-in fade-in duration-1000">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <Zap className="w-3 h-3 fill-blue-400" /> Estudiante Activo
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white">
            MI <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">PERFIL</span>
          </h1>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
            isEditing ? "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]" : "bg-white text-black hover:bg-blue-600 hover:text-white shadow-xl"
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TARJETA AVATAR */}
        <Card className="bg-[#05070a]/80 border-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardContent className="pt-10 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000 animate-pulse" />
              <img src={user?.imageUrl} className="relative w-36 h-36 rounded-full border-4 border-[#05070a] object-cover" alt="Perfil" />
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-white/5 border-white/10 text-center font-bold" />
              ) : (
                <h2 className="text-3xl font-black text-white">{profile.name}</h2>
              )}
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-4 rounded-full text-[9px] font-black uppercase tracking-widest">Estudiante Verificado</Badge>
            </div>
          </CardContent>
        </Card>

        {/* INFO DETALLADA */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#05070a]/60 border-white/5 backdrop-blur-3xl rounded-[2rem]">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-blue-400/60">Universidad</Label>
                  {isEditing ? <Input value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="bg-white/5 border-white/10" /> : <p className="text-white font-bold flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-500" /> {profile.university}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-blue-400/60">Especialidad</Label>
                  {isEditing ? <Input value={profile.career} onChange={e => setProfile({...profile, career: e.target.value})} className="bg-white/5 border-white/10" /> : <p className="text-white font-bold flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-500" /> {profile.career}</p>}
                </div>
              </div>
              <div className="space-y-2 pt-6 border-t border-white/5">
                <Label className="text-[10px] font-black uppercase text-blue-400/60">Bio del Estudiante</Label>
                {isEditing ? <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-white/5 border-white/10 min-h-[100px]" /> : <p className="text-gray-400 text-sm italic font-medium leading-relaxed">"{profile.bio}"</p>}
              </div>
            </CardContent>
          </Card>

          {/* NODOS */}
          <Card className="bg-[#05070a]/60 border-white/5 backdrop-blur-3xl rounded-[2rem]">
            <CardContent className="p-8 space-y-4">
              <Label className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" /> Temas de interés</Label>
              <div className="flex flex-wrap gap-2">
                {profile.topics.map(t => (
                  <Badge key={t} className="bg-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-bold">
                    {t} {isEditing && <X className="ml-2 w-3 h-3 cursor-pointer text-red-500" onClick={() => setProfile({...profile, topics: profile.topics.filter(i => i !== t)})} />}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Nuevo..." className="bg-white/5 border-white/10" />
                  <Button onClick={() => { if(newTopic) setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); }} className="bg-blue-600 px-4"><Plus className="w-4 h-4" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}