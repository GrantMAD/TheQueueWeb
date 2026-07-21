import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('media_items')
    .select('title, description')
    .eq('id', id)
    .single()

  const item = data as unknown as { title: string; description: string } | null

  return {
    title: item?.title ? `${item.title} | The Queue` : `Media ${id} | The Queue`,
    description: item?.description || 'View details and reviews on The Queue.',
  }
}

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
