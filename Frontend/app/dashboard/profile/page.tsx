"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Edit2, Save, Plus, X, Zap, Cpu, GraduationCap, BookOpen, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function CyberProfile() {
  const { isLoaded, user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState("")
  const [profile, setProfile] = useState({
    name: "", university: "", career: "", bio: "", topics: [] as string[]
  })

  useEffect(() => {
    if (isLoaded && user) {
      const saved = localStorage.getItem('unimatch_profile')
      if (saved) setProfile(JSON.parse(saved))
      else setProfile({
        name: user.fullName || "", university: "UNdeC", 
        career: "Ingeniería en Sistemas", bio: "Configurando nodo...", topics: ["Programación"]
      })
    }
  }, [isLoaded, user])

  const handleSave = async () => {
    try {
      const res = await fetch("https://unimatch-backend-vy3b.onrender.com/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          ...profile,
          imageUrl: user?.imageUrl
        }),
      })
      if (res.ok) {
        localStorage.setItem('unimatch_profile', JSON.stringify(profile))
        setIsEditing(false)
      } else { alert("Error en el enlace de datos") }
    } catch (e) { alert("Error de red") }
  }

  if (!isLoaded) return null

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 relative">
      {/* Luces de Neón de Fondo */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 blur-[120px] -z-10" />

      {/* Header Estilo Centro de Mando */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
            <ShieldCheck className="w-3 h-3" /> Estatus: Identidad Verificada
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Mi <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">Perfil</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-2 uppercase tracking-widest">Gestión de Nodo de Usuario</p>
        </div>
        <Button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform hover:scale-105"
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</> : <><Edit2 className="w-4 h-4 mr-2" /> Editar Acceso</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta de Identidad (Izquierda) */}
        <Card className="bg-[#05070a]/60 border-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
          <CardContent className="pt-10 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-md opacity-20 group-hover:opacity-60 transition duration-1000" />
              <img src={user?.imageUrl} className="relative w-36 h-36 rounded-full border-4 border-[#05070a] object-cover shadow-2xl" alt="Perfil" />
              <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-4 border-[#05070a]">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-white/5 border-white/10 text-center font-bold" />
              ) : (
                <h2 className="text-2xl font-black text-white tracking-tight">{profile.name}</h2>
              )}
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-4 rounded-full text-[9px] font-black uppercase tracking-widest">Estudiante Activo</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Info Académica y Nodos (Derecha) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#05070a]/60 border-white/5 backdrop-blur-3xl rounded-[2rem] hover:border-blue-500/20 transition-all duration-500">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Universidad</p>
                  {isEditing ? <Input value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="bg-white/5 border-white/10 rounded-xl" /> : <p className="text-white font-bold flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-500" /> {profile.university}</p>}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Especialidad</p>
                  {isEditing ? <Input value={profile.career} onChange={e => setProfile({...profile, career: e.target.value})} className="bg-white/5 border-white/10 rounded-xl" /> : <p className="text-white font-bold flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-500" /> {profile.career}</p>}
                </div>
              </div>
              <div className="space-y-2 pt-6 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Bitácora Biográfica</p>
                {isEditing ? <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-white/5 border-white/10 rounded-xl" /> : <p className="text-gray-400 text-sm italic font-medium">"{profile.bio}"</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#05070a]/60 border-white/5 backdrop-blur-3xl rounded-[2rem]">
            <CardContent className="p-8 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" /> Nodos de Conocimiento</p>
              <div className="flex flex-wrap gap-2">
                {profile.topics.map(t => (
                  <Badge key={t} className="bg-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-bold">
                    {t} {isEditing && <X className="ml-2 w-3 h-3 cursor-pointer text-red-500" onClick={() => setProfile({...profile, topics: profile.topics.filter(i => i !== t)})} />}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Nuevo nodo..." className="bg-white/5 border-white/10 rounded-xl" />
                  <Button onClick={() => { if(newTopic) setProfile({...profile, topics: [...profile.topics, newTopic]}); setNewTopic(""); }} className="bg-blue-600 rounded-xl px-4"><Plus className="w-4 h-4" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
