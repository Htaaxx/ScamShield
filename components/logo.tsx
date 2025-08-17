import { Shield } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Shield className="h-8 w-8 text-primary" />
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground">ScamShield</span>
        <span className="text-xs text-muted-foreground">AI Protection</span>
      </div>
    </div>
  )
}
