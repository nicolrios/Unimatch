"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Send, Paperclip, Smile, MoreVertical, Phone, 
  Video, Info, Image, File, X, Check, CheckCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  sender: "me" | "other"
  text: string
  time: string
  status: "sent" | "delivered" | "read"
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  typing?: boolean
}

const conversations: Conversation[] = [
  { id: 1, name: "Maria Garcia", avatar: "MG", lastMessage: "Nos vemos manana a las 3pm!", time: "Hace 5 min", unread: 2, online: true, typing: true },
  { id: 2, name: "John Smith", avatar: "JS", lastMessage: "El ejercicio 5 esta complicado", time: "Hace 20 min", unread: 0, online: true },
  { id: 3, name: "Ana Lopez", avatar: "AL", lastMessage: "Gracias por la explicacion!", time: "Hace 2 horas", unread: 0, online: false },
  { id: 4, name: "Carlos Ruiz", avatar: "CR", lastMessage: "Entonces quedamos asi?", time: "Ayer", unread: 0, online: true },
  { id: 5, name: "Emma Schmidt", avatar: "ES", lastMessage: "Perfect, see you then!", time: "Ayer", unread: 0, online: false },
  { id: 6, name: "Yuki Tanaka", avatar: "YT", lastMessage: "Arigatou!", time: "Hace 2 dias", unread: 0, online: false },
]

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "other", text: "Hola Juan! Como vas con el proyecto de Bases de Datos?", time: "14:30", status: "read" },
    { id: 2, sender: "me", text: "Hola Maria! Bien, ya termine el diagrama ER", time: "14:32", status: "read" },
    { id: 3, sender: "other", text: "Genial! Podemos revisar juntos el modelo relacional?", time: "14:33", status: "read" },
    { id: 4, sender: "me", text: "Claro, cuando te viene bien?", time: "14:35", status: "read" },
    { id: 5, sender: "other", text: "Que tal manana a las 3pm? Podemos usar la sala de estudio virtual", time: "14:36", status: "read" },
    { id: 6, sender: "me", text: "Perfecto! Ahi estare", time: "14:38", status: "read" },
    { id: 7, sender: "other", text: "Nos vemos manana a las 3pm!", time: "14:40", status: "read" },
  ],
  2: [
    { id: 1, sender: "me", text: "Hey John, how are you doing with the algorithms homework?", time: "12:15", status: "read" },
    { id: 2, sender: "other", text: "Hey! Im working on it right now", time: "12:20", status: "read" },
    { id: 3, sender: "other", text: "El ejercicio 5 esta complicado", time: "12:21", status: "read" },
  ],
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedChat])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const newMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent"
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }))
    setNewMessage("")
  }

  const selectedConversation = conversations.find(c => c.id === selectedChat)
  const currentMessages = selectedChat ? messages[selectedChat] || [] : []

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-border bg-card">
      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card",
        selectedChat && !showMobileList ? "hidden md:flex" : "flex"
      )}>
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Mensajes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar conversaciones..."
              className="pl-9 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelectedChat(conversation.id)
                  setShowMobileList(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                  selectedChat === conversation.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-secondary"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">{conversation.avatar}</span>
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground truncate">{conversation.name}</span>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    {conversation.typing ? (
                      <span className="text-sm text-primary">Escribiendo...</span>
                    ) : (
                      <span className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</span>
                    )}
                    {conversation.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedChat || showMobileList ? "hidden md:flex" : "flex"
      )}>
        {selectedChat && selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">{selectedConversation.avatar}</span>
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.typing 
                      ? "Escribiendo..." 
                      : selectedConversation.online 
                        ? "En linea" 
                        : "Desconectado"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Buscar en chat</DropdownMenuItem>
                    <DropdownMenuItem>Silenciar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Eliminar chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn(
                      "flex",
                      message.sender === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5",
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className={cn(
                        "flex items-center justify-end gap-1 mt-1",
                        message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        <span className="text-xs">{message.time}</span>
                        {message.sender === "me" && (
                          message.status === "read" ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Image className="w-4 h-4 mr-2" />
                      Imagen
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <File className="w-4 h-4 mr-2" />
                      Archivo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    className="pr-10 bg-secondary border-border"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  size="icon"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Selecciona una conversacion
              </h3>
              <p className="text-muted-foreground">
                Elige un chat de la lista para comenzar a hablar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
