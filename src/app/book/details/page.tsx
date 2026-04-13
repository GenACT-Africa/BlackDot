'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Check, User2 } from 'lucide-react'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/hooks/use-booking'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  projectTitle: z.string().min(2, 'Project title required'),
  projectNotes: z.string().optional(),
  talentId: z.string().nullable(),
})

type FormData = z.infer<typeof schema>

const STEPS = ['Service', 'Details', 'Schedule', 'Review']

export default function BookStep2() {
  const router = useRouter()
  const { state, hydrated, setDetails, goBack } = useBooking()
  const [talents, setTalents] = useState<{ id: string; name: string; roles: string[] }[]>([])

  useEffect(() => {
    const fetchTalents = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('talents')
        .select('id, name, roles')
        .eq('is_active', true)
        .order('display_order')
      if (data) setTalents(data)
    }
    fetchTalents()
  }, [])

  useEffect(() => {
    if (hydrated && state.services.length === 0) router.replace('/book')
  }, [hydrated, state.services.length, router])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectTitle: state.projectTitle,
      projectNotes: state.projectNotes,
      talentId: state.talentId,
    },
  })

  const selectedTalent = watch('talentId')

  const onSubmit = (data: FormData) => {
    setDetails({
      projectTitle: data.projectTitle,
      projectNotes: data.projectNotes || '',
      referenceLinks: [],
      talentId: data.talentId,
    })
    router.push('/book/schedule')
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i === 1 ? 'text-purple-400' : i < 1 ? 'text-purple-400' : 'text-white/30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i < 1
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : i === 1
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-white/20 text-white/30'
                }`}>
                  {i < 1 ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${i < 1 ? 'bg-purple-500/40' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-2">Project Details</h1>
        <p className="text-white/50 mb-8">Tell us about your project so we can prepare.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service reminder */}
          {state.services.length > 0 && (
            <div className="glass-purple rounded-xl p-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {state.services.map(({ service }) => (
                <div key={service.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span className="text-sm text-purple-300 font-medium">{service.name}</span>
                </div>
              ))}
            </div>
          )}

          <Input
            label="Project Title"
            placeholder="e.g. 'Fire EP Track 3'"
            error={errors.projectTitle?.message}
            {...register('projectTitle')}
          />

          <Textarea
            label="Project Notes (optional)"
            placeholder="Describe your vision, genre, references, mood, BPM if known..."
            rows={4}
            {...register('projectNotes')}
          />

          {/* Talent selection */}
          <div>
            <label className="text-sm font-medium text-white/70 mb-3 block">
              Choose a Talent (optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setValue('talentId', null)}
                className={`glass rounded-xl p-4 text-left border transition-all ${
                  !selectedTalent
                    ? 'border-purple-500/50 bg-purple-500/5'
                    : 'border-white/8 hover:border-purple-500/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  <User2 size={14} className="text-white/50" />
                </div>
                <p className="text-xs font-medium text-white">No preference</p>
                <p className="text-[10px] text-white/40">We&apos;ll assign the best fit</p>
              </button>

              {talents.map((talent) => (
                <button
                  key={talent.id}
                  type="button"
                  onClick={() => setValue('talentId', talent.id)}
                  className={`glass rounded-xl p-4 text-left border transition-all ${
                    selectedTalent === talent.id
                      ? 'border-purple-500/50 bg-purple-500/5'
                      : 'border-white/8 hover:border-purple-500/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-2">
                    <span className="text-xs font-bold text-white">{talent.name[0]}</span>
                  </div>
                  <p className="text-xs font-medium text-white">{talent.name}</p>
                  <p className="text-[10px] text-white/40">{talent.roles[0]}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={goBack}>
              <ArrowLeft size={14} />
              Back
            </Button>
            <Button type="submit" glow className="flex-1 group">
              Continue
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
