import type { Router } from "vue-router";

export const handleSignOut = async (router: Router) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/auth/signout`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Sign out failed');

    router.push('/Auth');
  } catch (err) {
    console.log('Sign out failed', err);
  }
};
