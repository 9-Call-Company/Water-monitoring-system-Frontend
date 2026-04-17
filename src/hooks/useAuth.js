import { useMemo } from "react";
import { decodeToken, getStoredToken } from "../utils/auth";

export default function useAuth() {
  return useMemo(() => {
    const token = getStoredToken();
    const user = decodeToken(token);
    return user
      ? { ...user, token }
      : { userId: null, role: null, fullName: null, token: null };
  }, []);
}
