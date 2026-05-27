import { supabase } from './supabaseClient';

export const signUp = async (
  email,
  password
) => {

  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (
  email,
  password
) => {

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {

  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {

  const {
    data
  } = await supabase.auth.getUser();

  return data.user;
};

export const onAuthStateChange = (
  callback
) => {

  return supabase.auth.onAuthStateChange(
    callback
  );
};