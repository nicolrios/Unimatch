"use client"

import { useState } from "react"
import { 
  Search, MessageSquare, Zap, 
  Sparkles, ShieldCheck, Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FuturisticChat() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="h-[calc(100vh-4rem)] p-2 md:p-6 animate-in fade-in zoom-in-95 duration-700">
      <Card className="h-full w-full bg-[#05070a]/80 border-white/10 backdrop-blur-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] rounded-[2.5rem]">
        
        {/* SIDEBAR: LISTA DE CHATS */}
        <aside className="w-full md:w-96 border-r border-white/5 flex flex-col bg-black/40">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-white via-blue-400 to-blue-800 bg-clip-text text-transparent">
                Inbox
              </h2>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                4 Activos
              </Badge>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-[#0d1117] border border-white/10 rounded-2xl px-4 py-2">
                <Search className="w-4 h-4 text-blue-500/50" />
                <Input 
                  placeholder="Buscar match..." 
                  className="border-0 focus-visible:ring-0 bg-transparent text-sm h-10 placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
              <Users className="w-12 h-12 text-blue-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sin hilos activos</p>
            </div>
          </div>
        </aside>

        {/* MAIN: PANTALLA DE BIENVENIDA FUTURISTA */}
        <main className="flex-1 flex flex-col items-center justify-center relative p-12 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
          
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full animate-pulse delay-700" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-8 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-all duration-1000 animate-bounce"></div>
              <div className="relative h-40 w-40 rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Zap className="w-20 h-20 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl shadow-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-white leading-none">
                UniMatch <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">Secure Chat</span>
              </h1>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                Conecta con tu próximo compañero de estudio en un entorno cifrado y de alta velocidad.
              </p>
            </div>

            <Button className="group relative h-14 px-10 bg-white text-black hover:bg-blue-500 hover:text-white font-black rounded-2xl transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-tighter">
                Explorar Compañeros <MessageSquare className="w-4 h-4" />
              </span>
            </Button>

            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest pt-10">
              <ShieldCheck className="w-4 h-4" /> Protocolo de estudio activo
            </div>
          </div>
        </main>
      </Card>
    </div>
  )
}