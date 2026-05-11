"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Send, MoreVertical, Phone, Video, Info, 
  Smile, Paperclip, MessageSquare, User, CheckCheck 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatPage() {
  // 1. Limpiamos los contactos: Ahora es un array vacío []
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messageInput, setMessageInput] = useState("")

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Sidebar de Contactos */}
      <div className="w-full md:w-80 border-r border-border flex flex-col bg-card/50">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Mensajes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar conversaciones..." 
              className="pl-9 bg-secondary/50 border-border"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {contacts.length > 0 ? (
            <div className="divide-y divide-border/50">
              {/* Aquí se renderizarán los chats cuando tengas */}
            </div>
          ) : (
            <div className="p-8 text-center mt-10">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">No hay mensajes</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tus conversaciones aparecerán aquí cuando hagas match con alguien.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Área del Chat */}
      <div className="hidden md:flex flex-1 flex-col bg-background/30">
        {!selectedContact ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-4 rotate-3">
              <MessageSquare className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Selecciona un chat</h3>
            <p className="text-muted-foreground max-w-xs mt-2">
              Elige una conversación de la izquierda o busca nuevos compañeros en la sección de "Buscar".
            </p>
            <Button variant="outline" className="mt-6 border-primary/20 hover:bg-primary/5">
              Explorar compañeros
            </Button>
          </div>
        ) : (
          /* Esta parte solo se verá cuando selecciones a alguien real */
          <div className="flex-1 flex flex-col">
             {/* Header del chat seleccionado */}
          </div>
        )}
      </div>
    </div>
  )
}