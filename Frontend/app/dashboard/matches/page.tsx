"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Search, Users, Clock, BookOpen, Star, Send, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MatchUser {
  id: string; name: string; university: string; imageUrl: string;
  commonTopics: string[]; matchPercentage?: number;
}

export default function MatchesPage() {
  const { user, isLoaded } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestedMatches, setSuggestedMatches] = useState<MatchUser[]>([])
  const [loading, setLoading] = useState(true)
  const [sentRequests, setSentRequests] = useState<string[]>([])
  const [topicCount, setTopicCount] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('unimatch_profile')
    if (saved) setTopicCount(JSON.parse(saved).topics?.length || 0)
  }, [])

  const fetchSuggestions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`https://unimatch-nm86mqg53-nicolrios-projects.onrender.com/api/matches/suggestions/${user.id}`);
      setSuggestedMatches(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) { fetchSuggestions(); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://unimatch-nm86mqg53-nicolrios-projects.onrender.com/api/matches/search?q=${searchQuery}&clerkId=${user?.id}`);
      setSuggestedMatches(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  useEffect(() => { if (isLoaded && user) fetchSuggestions(); }, [isLoaded, user])

  if (!isLoaded) return <p className="p-10 text-center">Cargando...</p>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-white">
      <h1 className="text-3xl font-bold">¡Hola, {user?.firstName || "Estudiante"}!</h1>
      
      <div className="flex gap-3 max-w-2xl">
        <Input 
          placeholder="Buscar materia..." 
          className="bg-card" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <Button onClick={handleSearch}>Buscar Compañeros</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Matches", value: "0", icon: Users },
          { label: "Pendientes", value: "0", icon: Clock },
          { label: "Temas", value: String(topicCount), icon: BookOpen },
          { label: "Sugeridos", value: String(suggestedMatches.length), icon: Star },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50">
            <CardContent className="p-4 flex items-center gap-4">
              <stat.icon className="text-primary" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] uppercase text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sugeridos">
        <TabsList className="bg-secondary/20">
          <TabsTrigger value="sugeridos">Sugeridos ({suggestedMatches.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="sugeridos" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestedMatches.map((match) => (
            <Card key={match.id} className="border-border/50">
              <CardHeader>
                <Avatar><AvatarImage src={match.imageUrl} /><AvatarFallback>{match.name[0]}</AvatarFallback></Avatar>
                <CardTitle className="mt-2">{match.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{match.university}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {match.commonTopics.map(t => <Badge key={t} variant="secondary" className="text-[9px]">{t}</Badge>)}
                </div>
                <Button 
                  className="w-full" 
                  disabled={sentRequests.includes(match.id)}
                  onClick={() => setSentRequests([...sentRequests, match.id])}
                >
                  {sentRequests.includes(match.id) ? "Enviada" : "Enviar Solicitud"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}