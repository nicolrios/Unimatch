"use client"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

interface Suggestion {
  id: string
  name: string
  career: string
  imageUrl: string
  commonTopics: string[]
  commonTopicsCount: number
}

export default function MatchesPage() {
  const { user } = useUser()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return
      try {
        const res = await fetch(`https://unimatch-backend-vy3b.onrender.com/api/matches/suggestions/${user.id}`)
        const data = await res.json()
        setSuggestions(data)
      } catch (err) {
        console.error("Error cargando matches", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [user])

  if (loading) return <div className="p-10 text-center text-blue-400 animate-pulse">Escaneando la red en busca de matches...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Sugerencias de Conexión
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.length > 0 ? (
          suggestions.map((match) => (
            <div key={match.id} className="bg-[#0a0f1a] border border-blue-500/20 p-5 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="flex items-center space-x-4 mb-4">
                <img src={match.imageUrl} alt={match.name} className="w-16 h-16 rounded-full border-2 border-blue-500" />
                <div>
                  <h3 className="font-bold text-lg">{match.name}</h3>
                  <p className="text-gray-400 text-sm">{match.career}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Intereses compartidos</p>
                <div className="flex flex-wrap gap-2">
                  {match.commonTopics.map(topic => (
                    <span key={topic} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md border border-blue-500/20">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                Conectar
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">Todavía no hay usuarios con tus mismos intereses. ¡Invita a tus compañeros!</p>
        )}
      </div>
    </div>
  )
}