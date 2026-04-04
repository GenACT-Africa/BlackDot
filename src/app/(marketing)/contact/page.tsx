'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MessageSquare, Phone, Send, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_inquiries').insert([data])
      if (error) throw error
      toast.success('Message sent! We\'ll reply within 24 hours.')
      reset()
    } catch {
      toast.error('Failed to send. Please try WhatsApp instead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-40" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Get in Touch</p>
            <h1 className="text-5xl font-black text-white mb-6">Let&apos;s Talk.</h1>
            <p className="text-white/50 text-lg mb-10 leading-relaxed">
              Have a project in mind? Want to discuss a custom package? Reach out — we reply fast.
            </p>

            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'info@blackdotmusic.com', href: 'mailto:info@blackdotmusic.com' },
                { icon: Phone, label: 'WhatsApp', value: '+255 700 000 000', href: 'https://wa.me/255700000000' },
                { icon: MapPin, label: 'Location', value: 'Dar es Salaam, Tanzania', href: null },
                { icon: MessageSquare, label: 'Instagram', value: '@blackdotmusic', href: 'https://instagram.com' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-purple-300 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-white">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <Input
                label="Phone (optional)"
                placeholder="+255..."
                {...register('phone')}
              />
              <Input
                label="Subject"
                placeholder="What's this about?"
                error={errors.subject?.message}
                {...register('subject')}
              />
              <Textarea
                label="Message"
                placeholder="Tell us about your project..."
                rows={5}
                error={errors.message?.message}
                {...register('message')}
              />
              <Button type="submit" loading={loading} className="w-full group" size="lg" glow>
                <Send size={16} />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
