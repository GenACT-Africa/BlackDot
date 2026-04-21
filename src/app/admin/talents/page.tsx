import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Manage Talents – Admin',
  description: 'Manage BlackDot Music talent profiles — add new producers, update bios, roles and genres, manage social links, and control which profiles are publicly visible.',
}

import { Badge } from '@/components/ui/badge'
import type { Talent } from '@/types'

export default async function AdminTalentsPage() {
  const supabase = await createClient()
  const { data: talents } = await supabase
    .from('talents')
    .select('*')
    .order('display_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Talents</h1>
        <Link href="/admin/talents/new">
          <Button glow size="sm"><Plus size={14} /> Add Talent</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {(talents as Talent[] || []).map((talent) => (
          <Link key={talent.id} href={`/admin/talents/${talent.id}`}>
            <div className="glass rounded-2xl p-5 border border-white/8 hover:border-purple-500/30 transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {talent.avatar_url ? (
                    <Image src={talent.avatar_url} alt={talent.name} width={56} height={56} className="object-cover" />
                  ) : (
                    <span className="text-xl font-black text-white">{talent.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {talent.name}
                    </h3>
                    {talent.is_featured && (
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-white/50 mb-2">{talent.roles.join(', ')}</p>
                  <div className="flex flex-wrap gap-1">
                    {talent.genres.slice(0, 3).map((g) => (
                      <Badge key={g} variant="purple" size="sm">{g}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                <span className={`text-xs ${talent.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {talent.is_active ? '● Active' : '● Inactive'}
                </span>
                <span className="text-xs text-white/30 group-hover:text-purple-400 transition-colors">
                  Edit →
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Add new card */}
        <Link href="/admin/talents/new">
          <div className="glass rounded-2xl p-5 border border-dashed border-white/15 hover:border-purple-500/30 transition-all cursor-pointer group flex items-center justify-center h-[160px]">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 mx-auto mb-2 group-hover:bg-purple-500/25 transition-colors">
                <Plus size={20} />
              </div>
              <p className="text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                Add Talent
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
