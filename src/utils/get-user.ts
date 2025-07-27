type TUser= {
    dbUser: {
        id: string;
        email: string;
        joinedAt: string;
        role: 'user' | 'admin';
    };
    username: string;
    photoUrl: string | undefined;
} 
export const getUser= async (): Promise< TUser | null>=>{
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