"use client"

import { CheckCircle, AlertTriangle, ExternalLink, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ScamResult {
  isScam: boolean
  confidence: number
  analysis: string
  analysisWithCitations?: string
  detectedPatterns: string[]
  resources: {
    id: number
    title: string
    description: string
    url: string
    source: string
  }[]
}

interface ScamResultsProps {
  result: ScamResult
  onAnalyzeAnother: () => void
}

export function ScamResults({ result, onAnalyzeAnother }: ScamResultsProps) {
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null)
  const [selectedSource, setSelectedSource] = useState<ScamResult["resources"][0] | null>(null)

  const handleCitationClick = (sourceId: number) => {
    setHighlightedSource(sourceId)
    const source = result.resources.find((res) => res.id === sourceId)
    if (source) {
      setSelectedSource(source)
    }
  }

  const renderAnalysisWithCitations = (text: string) => {
    if (!result.analysisWithCitations) return <span>{text}</span>

    const parts = result.analysisWithCitations.split(/(\[\d+(?:,\d+)*\])/)

    return (
      <span>
        {parts.map((part, index) => {
          const citationMatch = part.match(/\[(\d+(?:,\d+)*)\]/)
          if (citationMatch) {
            const sourceIds = citationMatch[1].split(",").map((id) => Number.parseInt(id.trim()))
            return (
              <span key={index} className="inline-flex gap-1">
                {sourceIds.map((sourceId, idx) => (
                  <button
                    key={`${sourceId}-${idx}`}
                    onClick={() => handleCitationClick(sourceId)}
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[28px] h-6 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer border-0"
                  >
                    [{sourceId}]
                  </button>
                ))}
              </span>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </span>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Result Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {result.isScam ? (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            <div>
              <h3 className="text-xl font-bold">
                {result.isScam ? "⚠️ Potential Scam Detected" : "No Scam Detected"}
              </h3>
              <p className="text-sm text-muted-foreground">Confidence: {result.confidence}%</p>
            </div>
          </div>

          <Badge variant={result.isScam ? "destructive" : "secondary"} className="text-sm px-3 py-1">
            {result.isScam ? "HIGH RISK" : "SAFE"}
          </Badge>
        </div>

        {/* AI Analysis with Citations */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            AI Analysis
          </h4>
          <div className="text-sm leading-relaxed">{renderAnalysisWithCitations(result.analysis)}</div>
        </div>

        {/* Resources and Citations */}
        <div>
          <h4 className="font-semibold mb-3">📚 Sources & References:</h4>
          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 h-48 overflow-y-auto">
            {result.resources.map((resource) => (
              <div
                key={resource.id}
                id={`source-${resource.id}`}
                className={`border rounded-lg p-2 transition-all duration-300 h-fit ${
                  highlightedSource === resource.id
                    ? "bg-blue-50 border-blue-400 shadow-lg scale-[1.02] ring-2 ring-blue-200"
                    : "hover:bg-muted/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex gap-2 flex-1 min-w-0">
                    <div className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-sm flex-shrink-0">
                      [{resource.id}]
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-xs mb-1 text-foreground line-clamp-1">{resource.title}</h5>
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{resource.description}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                        <p className="text-xs text-green-700 truncate">{resource.source}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 h-5 w-5 p-0 flex-shrink-0"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Detail Modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">Source [{selectedSource.id}] Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSource(null)}>
                  ×
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Title:</p>
                  <p className="text-sm text-muted-foreground">{selectedSource.title}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Description:</p>
                  <p className="text-sm text-muted-foreground">{selectedSource.description}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Source:</p>
                  <p className="text-sm text-muted-foreground">{selectedSource.source}</p>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button asChild className="flex-1">
                    <a href={selectedSource.url} target="_blank" rel="noopener noreferrer">
                      Open Source
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedSource(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t">
          <Button onClick={onAnalyzeAnother} variant="outline" className="w-full bg-transparent">
            Analyze Another Audio File
          </Button>
        </div>
      </div>
    </Card>
  )
}
