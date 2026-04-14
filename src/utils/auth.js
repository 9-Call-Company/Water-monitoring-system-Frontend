export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId ?? payload.id ?? payload.sub,
      role: payload.role,
      fullName: payload.fullName ?? payload.full_name ?? payload.name ?? '',
    };
  } catch {
    return null;
  }
};

export const isAdmin = () => getCurrentUser()?.role === 'admin';
export const isAgent = () => getCurrentUser()?.role === 'agent';
export const isUser = () => getCurrentUser()?.role === 'user';
