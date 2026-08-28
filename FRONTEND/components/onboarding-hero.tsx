import { CloudSun, Leaf, ShieldCheck } from 'lucide-react'
import { KrishiLogo } from '@/components/krishi-logo'

const highlights = [
  { icon: ShieldCheck, label: 'Crop disease detection' },
  { icon: CloudSun, label: 'Hyper-local weather advisory' },
  { icon: Leaf, label: 'Soil & fertilizer guidance' },
]

export function OnboardingHero() {
  return (
    <section className="relative hidden overflow-hidden lg:flex lg:w-1/2">
      {/* Background image */}
      <img
        src="/images/farm-hero.png"
        alt="Aerial view of lush green terraced farmland"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Green wash overlay for brand cohesion + text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1B5E20]/85 via-[#2E7D32]/70 to-[#4CAF50]/60"
        aria-hidden="true"
      />
      {/* Subtle dotted agricultural pattern */}
      <div
        className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1.5px)] [background-size:26px_26px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full flex-col justify-between p-10 text-white xl:p-14">
        <KrishiLogo
          wordClassName="text-white text-2xl"
          markClassName="bg-white/15 backdrop-blur-sm"
        />

        <div className="max-w-md">
          <h1 className="text-pretty text-4xl font-bold leading-tight xl:text-5xl">
            AI-Powered Farm Intelligence
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/85">
            From seed to harvest, KrishiRakshak guards your fields with instant,
            AI-driven insight — spoken in your own language.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-white/90">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/70">
          Trusted by farming communities across rural India.
        </p>
      </div>
    </section>
  )
}
