// ─── Token storage helpers ────────────────────────────────────────────────────

export const getStoredToken = () => localStorage.getItem("token");

export const setStoredToken = (token) => localStorage.setItem("token", token);

export const removeStoredToken = () => localStorage.removeItem("token");

// ─── JWT decode ───────────────────────────────────────────────────────────────

/**
 * Decode a raw JWT string and return a normalised user object.
 * Returns null if the token is missing or malformed.
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      // numeric id used internally
      userId: payload.userId ?? payload.id ?? payload.sub ?? null,
      // role string: 'admin' | 'agent' | 'user'
      role: payload.role ?? null,
      // display name – try every common claim name
      fullName: payload.fullName ?? payload.full_name ?? payload.name ?? "",
      full_name: payload.fullName ?? payload.full_name ?? payload.name ?? "",
      // extra claims the backend may include
      email: payload.email ?? "",
      username: payload.username ?? "",
    };
  } catch {
    return null;
  }
};

// ─── Convenience: read + decode in one call ───────────────────────────────────

/**
 * Read the token from localStorage and decode it.
 * Used by components that need the current user without the AuthContext.
 */
export const getCurrentUser = () => decodeToken(getStoredToken());

// ─── Role helpers ─────────────────────────────────────────────────────────────

export const isAdmin = () => getCurrentUser()?.role === "admin";
export const isAgent = () => getCurrentUser()?.role === "agent";
export const isUser = () => getCurrentUser()?.role === "user";
