import { supabase }
from './supabaseClient';

export const getUserSubscription =
  async (userId) => {

    const {
      data,
      error
    } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order(
        'created_at',
        { ascending: false }
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
};