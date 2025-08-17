"use client"

import { useState } from "react"
import { Search, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const commonScams = [
  "Police asking for money transfer",
  "Court fine payment request",
  "Bank account verification",
  "Lottery winner notification",
  "Investment opportunity",
  "Emergency money request",
]

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSearch = () => {
    if (!query.trim()) return

    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleQuickSearch = (scamType: string) => {
    setQuery(scamType)
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Detect Scam Messages</h3>
          <p className="text-sm text-muted-foreground">
            Enter suspicious text messages or describe the situation to check for scam patterns
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter suspicious message or describe the situation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="h-12"
            />
          </div>
          <Button onClick={handleSearch} disabled={!query.trim() || isAnalyzing} className="h-12 px-6">
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Common scam types:</p>
          <div className="flex flex-wrap gap-2">
            {commonScams.map((scam, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleQuickSearch(scam)}
              >
                {scam}
              </Badge>
            ))}
          </div>
        </div>

        {isAnalyzing && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-primary">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Analyzing message against scam database...</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
