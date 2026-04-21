import type { Metadata } from 'next'
import { HeroSection } from '@/components/marketing/hero-section'

export const metadata: Metadata = {
  title: { absolute: 'BlackDot Music | World-Class Recording Studio in Dar es Salaam' },
  description: "East Africa's premier recording studio in Dar es Salaam. Professional recording, mixing, mastering & beats production — in-studio sessions or remote worldwide.",
}


import { StatsBar } from '@/components/marketing/stats-bar'
import { ServicesGrid } from '@/components/marketing/services-grid'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { TalentsSection } from '@/components/marketing/talents-section'
import { Testimonials } from '@/components/marketing/testimonials'
import { CTASection } from '@/components/marketing/cta-section'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: talents }, { data: testimonials }] = await Promise.all([
    supabase
      .from('talents')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('display_order')
      .limit(3),
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .limit(5),
  ])

  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <HowItWorks />
      <TalentsSection talents={talents ?? []} />
      <Testimonials testimonials={testimonials ?? []} />
      <CTASection />
    </>
  )
}
