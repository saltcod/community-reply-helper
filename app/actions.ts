'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markTriageResolved(triageId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('contribute_thread_triage')
    .update({ status: 'resolved' })
    .eq('id', triageId)
    .select();

  if (error) {
    console.error('Error marking triage as resolved:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to mark triage as resolved: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.error('No rows updated for triage ID:', triageId);
    throw new Error('No rows were updated. This might be a permissions issue.');
  }

  console.log('Successfully marked triage as resolved:', data);
  revalidatePath('/');
  revalidatePath('/protected/triage');

  return { success: true };
}
