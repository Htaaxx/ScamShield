import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AudioUpload } from "@/components/audio-upload"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Start Your Scam Check</h2>
            <p className="text-muted-foreground">
              Upload audio files or record conversations to analyze for potential scams
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <AudioUpload />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
