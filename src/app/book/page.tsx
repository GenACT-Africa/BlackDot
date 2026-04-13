'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mic, Globe, Music, SlidersHorizontal, Check, ArrowRight } from 'lucide-react'
import { useBooking } from '@/lib/hooks/use-booking'
import { Button } from '@/components/ui/button'
import { formatTZS } from '@/lib/utils/currency'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/types'

const ICONS: Record<string, React.ReactNode> = {
  Mic: <Mic size={22} />,
  Globe: <Globe size={22} />,
  Music: <Music size={22} />,
  Sliders: <SlidersHorizontal size={22} />,
}

const STEPS = ['Service', 'Details', 'Schedule', 'Review']

function BookStep1Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselect = searchParams.get('service')
  const { state, toggleService, proceedFromServices, hydrated } = useBooking()
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      if (data) {
        setServices(data)
        // Auto-select preselect param if no services chosen yet
        if (preselect && hydrated && state.services.length === 0) {
          const match = data.find((s: Service) => s.slug === preselect)
          if (match) toggleService(match)
        }
      }
      setLoadingServices(false)
    }
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  const isSelected = (service: Service) =>
    state.services.some(s => s.service.id === service.id)

  const handleContinue = () => {
    proceedFromServices()
    router.push('/book/details')
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i === 0 ? 'text-purple-400' : 'text-white/30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i === 0
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-white/20 text-white/30'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 bg-white/10`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-white mb-2">Choose Your Services</h1>
        <p className="text-white/50">Select all the services you need — you can combine multiple.</p>
      </motion.div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {loadingServices ? (
          <div className="col-span-2 h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : null}
        {services.map((service, i) => {
          const selected = isSelected(service)
          const billingLabel = { hour: '/ hr', track: '/ track', project: '/ project' }[service.billing_unit]

          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => toggleService(service)}
              className={`text-left glass rounded-2xl p-6 border transition-all duration-200 w-full group ${
                selected
                  ? 'border-purple-500/50 shadow-glow-purple-sm bg-purple-500/5'
                  : 'border-white/8 hover:border-purple-500/30 hover:shadow-glow-purple-sm'
              }`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                selected ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25'
              }`}>
                {ICONS[service.icon || 'Mic']}
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-white">{service.name}</h3>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  selected
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-white/20 bg-transparent'
                }`}>
                  {selected && <Check size={10} className="text-white" />}
                </div>
              </div>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">{service.description}</p>

              <div>
                <span className="text-lg font-black gradient-text">{formatTZS(service.price_tzs)}</span>
                <span className="text-xs text-white/40 ml-1">{billingLabel}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Selected count + Continue */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        {state.services.length > 0 && (
          <span className="text-xs text-white/40">
            {state.services.length} service{state.services.length > 1 ? 's' : ''} selected
          </span>
        )}
        <Button
          onClick={handleContinue}
          disabled={state.services.length === 0}
          glow
          className="flex-1 group"
        >
          Continue
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  )
}

export default function BookStep1() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>}>
      <BookStep1Content />
    </Suspense>
  )
}
