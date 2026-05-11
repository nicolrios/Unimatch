"use client"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Search, UserPlus, BookOpen, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
  const { user, isLoaded } = useUser()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMatches = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`https://unimatch-nm86mqg53-nicolrios-projects.onrender.com/api/matches/suggestions/${user.id}`);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (isLoaded && user) fetchMatches(); }, [isLoaded, user]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Buscar Compañeros</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por materia..." className="pl-10 h-12" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2"><UserPlus className="text-primary" /> Sugerencias Reales</h2>
        {loading ? <p>Buscando estudiantes...</p> : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m: any) => (
              <Card key={m.id} className="hover:border-primary/50 transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <img src={m.imageUrl} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.university}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.commonTopics.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost"><MessageCircle className="w-5 h-5" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-secondary/10 rounded-2xl border-2 border-dashed">
            <BookOpen className="mx-auto h-10 w-10 mb-4 opacity-20" />
            <p className="font-medium">No hay usuarios con tus mismos temas todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}