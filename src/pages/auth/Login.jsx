import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

function redirectByRole(role, navigate) {
  const routes = {
    admin: "/admin/dashboard",
    agent: "/agent/dashboard",
    user: "/user/dashboard",
  };

  navigate(routes[role] ?? "/login", { replace: true });
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || "Unable to sign in");
      return;
    }

    const roleHome = {
      admin: "/admin/dashboard",
      agent: "/agent/dashboard",
      user: "/user/dashboard",
    };
    const from = location.state?.from?.pathname;
    const destination =
      from && from !== "/login" ? from : roleHome[result.user?.role] || "/";
    navigate(destination, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-wcam-black px-4 font-mono text-white">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-wcam-card p-8 shadow-soft">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-wcam-orange text-sm font-bold text-black">
          W
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-[0.18em] text-white">
          WCAM
        </h1>
        <p className="mt-2 text-center text-xs text-zinc-400">
          Water Community Administration
        </p>

        <div className="my-6 border-t border-wcam-border" />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-[11px] text-zinc-400">
            Email address
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] px-3 py-2 focus-within:border-wcam-orange">
              <Mail className="h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                placeholder="name@company.com"
              />
            </div>
          </label>

          <label className="block text-[11px] text-zinc-400">
            Password
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0D0D0D] px-3 py-2 focus-within:border-wcam-orange">
              <Lock className="h-4 w-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-zinc-500 transition hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg bg-wcam-orange px-4 py-3 text-sm font-medium text-black transition hover:bg-wcam-orangeHover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <LoadingSpinner size={16} /> : "Login"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-500">
          Forgot password?
        </div>
      </div>
    </div>
  );
}
