import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('groups')
    .select('name, description')
    .eq('id', id)
    .single()

  const item = data as unknown as { name: string; description: string } | null

  return {
    title: item?.name ? `${item.name} | The Queue` : `Group ${id} | The Queue`,
    description: item?.description || 'View group details and media pool on The Queue.',
  }
}

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
