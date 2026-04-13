export function decodeToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return {
      userId: json.userId ?? json.id ?? json.sub ?? null,
      role: json.role ?? "user",
      fullName: json.fullName ?? json.full_name ?? json.name ?? "User",
      token,
      ...json,
    };
  } catch {
    return { userId: null, role: "user", fullName: "User", token };
  }
}

export function getStoredToken() {
  return localStorage.getItem("token");
}
