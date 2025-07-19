export const getUser= async ()=>{
  try {
    const res = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/auth/me`, {
      credentials: 'include',
    });
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.log('Failed to fetch user info', error);
    return null;
  }
}