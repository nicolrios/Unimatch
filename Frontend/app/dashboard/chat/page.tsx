"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatPage() {
  // Al dejar esto como [] (vacío), es IMPOSIBLE que aparezcan Maria o John.
  const contacts = []; 

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Sidebar de Contactos vacío */}
      <div className="w-full md:w-80 border-r border-border flex flex-col bg-card/50">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Mensajes</h2>
          <Input placeholder="Buscar..." className="bg-secondary/50" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No hay conversaciones</p>
        </div>
      </div>

      {/* Pantalla principal de bienvenida */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-background/30 p-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">¡Bienvenido a tu Chat!</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          Aquí aparecerán tus matches. Ve a la sección de "Buscar" para encontrar compañeros de estudio.
        </p>
        <Button className="mt-6">Explorar compañeros</Button>
      </div>
    </div>
  )
}