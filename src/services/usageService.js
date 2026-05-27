import { supabase }
from './supabaseClient';

export const getUserUsage =
  async (userId) => {

    const {
      data,
      error
    } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
};

export const createUserUsage =
  async (userId) => {

    const {
      data,
      error
    } = await supabase
      .from('user_usage')
      .insert([
        {
          user_id: userId,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
};

export const incrementUsage =
  async (
    userId,
    pagesProcessed
  ) => {

    const usage =
      await getUserUsage(userId);

    const {
      error
    } = await supabase
      .from('user_usage')
      .update({
        pages_processed:
          usage.pages_processed +
          pagesProcessed,

        pdfs_processed:
          usage.pdfs_processed + 1,

        updated_at:
          new Date(),
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
};

export const ensureUserUsage =
  async (userId) => {

    const {
      data
    } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      return data;
    }

    return await createUserUsage(
      userId
    );
};