"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Mic, FileAudio, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScamResults } from "./scam-results"

type ProcessingState = "idle" | "uploading" | "processing" | "completed" | "error"

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

export function AudioUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>("idle")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScamResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setUploadedFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const analyzeFile = async () => {
    if (!uploadedFile) return

    setProcessingState("uploading")
    setProgress(0)

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setProcessingState("processing")
          processAudio()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const processAudio = async () => {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockResult: ScamResult = {
      isScam: Math.random() > 0.5,
      confidence: Math.floor(Math.random() * 30) + 70,
      analysis:
        "The audio contains several red flags commonly associated with financial scams, including urgent language, requests for immediate money transfer, and impersonation of authority figures. The caller claims to be from a government agency and demands immediate payment to avoid legal consequences.",
      analysisWithCitations:
        "The audio contains several red flags commonly associated with financial scams, including urgent language, requests for immediate money transfer, and impersonation of authority figures [1,2]. The caller claims to be from a government agency and demands immediate payment to avoid legal consequences [3]. This pattern matches known scam tactics documented by law enforcement agencies [1,4].",
      detectedPatterns: [
        "Urgent money transfer request",
        "Impersonation of government official",
        "Threats of legal consequences",
        "Request for personal banking information",
      ],
      resources: [
        {
          id: 1,
          title: "How to Identify Phone Scams",
          description: "Official guide from Singapore Police Force on recognizing and avoiding phone scams",
          url: "https://www.police.gov.sg/Advisories/Crime/Commercial-Crimes/Phone-Scam",
          source: "Singapore Police Force",
        },
        {
          id: 2,
          title: "Common Scam Tactics",
          description: "Database of known scam patterns and red flags to watch out for",
          url: "https://www.scamalert.sg/types-of-scams",
          source: "ScamAlert Singapore",
        },
        {
          id: 3,
          title: "Government Impersonation Scams",
          description: "How scammers impersonate government officials and what to do",
          url: "https://www.police.gov.sg/Advisories/Crime/Commercial-Crimes/Government-Official-Impersonation-Scam",
          source: "Singapore Police Force",
        },
        {
          id: 4,
          title: "Report Scam Hotline",
          description: "24/7 hotline to report suspected scams and get immediate assistance",
          url: "https://www.police.gov.sg/I-Witness",
          source: "National Crime Prevention Council",
        },
      ],
    }

    setResult(mockResult)
    setProcessingState("completed")
  }

  const resetAnalysis = () => {
    setUploadedFile(null)
    setProcessingState("idle")
    setProgress(0)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (processingState === "completed" && result) {
    return <ScamResults result={result} onAnalyzeAnother={resetAnalysis} />
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Upload Audio for Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Upload a call recording or record live audio to check for scam patterns
          </p>
        </div>

        {processingState === "uploading" && (
          <div className="space-y-3">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="font-medium">Uploading audio file...</p>
              <p className="text-sm text-muted-foreground">Please wait while we upload your file</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {processingState === "processing" && (
          <div className="space-y-3">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="font-medium">AI Analysis in Progress...</p>
              <p className="text-sm text-muted-foreground">
                Our AI is analyzing the audio for scam patterns using Southeast Asian language models
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Processing speech-to-text conversion...
              </div>
            </div>
          </div>
        )}

        {processingState === "idle" && (
          <>
            {!uploadedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your audio file here, or click to browse
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileAudio className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <Button variant={isRecording ? "destructive" : "secondary"} onClick={toggleRecording}>
                    <Mic className="h-4 w-4 mr-2" />
                    {isRecording ? "Stop Recording" : "Record Audio"}
                  </Button>
                </div>
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileInput} className="hidden" />
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileAudio className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <Button className="w-full" onClick={analyzeFile}>
                    Analyze for Scam Patterns
                  </Button>
                </div>
              </div>
            )}

            {isRecording && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="font-medium">Recording in progress...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
