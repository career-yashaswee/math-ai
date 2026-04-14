import { type Metadata } from "next";
import { LoginButton } from "@/features/auth/components/LoginButton";
import { Brain, Zap, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to MathAI to start practising JEE & NEET Mathematics",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Ambient green glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "oklch(0.696 0.191 142.495)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center green-glow">
              <Brain className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" fill="currentColor" />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight gradient-text mb-2">
            MathAI
          </h1>
          <p className="text-muted-foreground text-center text-sm leading-relaxed max-w-xs">
            AI-powered Mathematics practice for Class 12 JEE & NEET students
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8 border border-border/50">
          <h2 className="text-xl font-semibold text-center mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Sign in to continue your practice journey
          </p>

          <LoginButton className="w-full" />

          <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            <span className="text-primary/70">
              For Class 12 Mathematics — JEE & NEET preparation
            </span>
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Target, label: "Smart Practice" },
            { icon: Brain, label: "AI Analysis" },
            { icon: Zap, label: "Track Progress" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="glass rounded-xl p-3 flex flex-col items-center gap-2 border border-border/30"
            >
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-xs text-muted-foreground text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
