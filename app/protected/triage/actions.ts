'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markTriageResolved(triageId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('contribute_thread_triage')
    .update({ status: 'resolved' })
    .eq('id', triageId);

  if (error) {
    console.error('Error marking triage as resolved:', error);
    throw new Error('Failed to mark triage as resolved');
  }

  revalidatePath('/protected/triage');
}
