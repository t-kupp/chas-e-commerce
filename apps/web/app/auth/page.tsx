"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../app/context/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        await register(username, email, password);
      }
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : isLogin ? "Login failed" : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode() {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-2xl overflow-hidden flex border border-yellow-500/30">
        {/* left side - form */}
        <main className="w-full lg:w-1/2 p-8 lg:p-12" role="main" aria-labelledby="auth-heading">
          <div className="mb-8">
            <Link
              href="/"
              className="text-3xl font-extrabold flex items-center gap-2"
              aria-label="Return to Pokémon Store home page"
            >
              <span className="text-gray-100">POKÉMON</span>
              <span className="text-yellow-400">STORE</span>
            </Link>
          </div>

          <div>
            <h1 id="auth-heading" className="text-4xl font-extrabold text-gray-100 mb-2">
              {isLogin ? "Welcome back, Trainer" : "Start your journey"}
            </h1>
            <p className="text-gray-400 mb-8">
              {isLogin ? "Sign in to catch 'em all." : "Register now to access exclusive cards."}
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
            aria-label={isLogin ? "Sign in form" : "Registration form"}
            noValidate
          >
            {error && (
              <div
                className="rounded-lg bg-red-900/40 p-4 border border-red-700"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}{" "}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg placeholder-gray-500 text-gray-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  placeholder="Enter your Trainer name"
                  aria-required="true"
                  autoComplete="username"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg placeholder-gray-500 text-gray-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                placeholder="Enter your email"
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg placeholder-gray-500 text-gray-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                placeholder="••••••••"
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={6}
                aria-describedby={!isLogin ? "password-requirements" : undefined}
              />
              {!isLogin && (
                <p id="password-requirements" className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-600 rounded-lg placeholder-gray-500 text-gray-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  placeholder="••••••••"
                  aria-required="true"
                  aria-invalid={error && error.includes("match") ? "true" : "false"}
                  autoComplete="new-password"
                  aria-describedby="confirm-password-description"
                />
                <p id="confirm-password-description" className="sr-only">
                  Re-enter your password to confirm
                </p>
              </div>
            )}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded bg-gray-700"
                    aria-label="Remember me for future logins"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-yellow-400 hover:text-yellow-300"
                  aria-label="Reset your password"
                >
                  Forgot password?
                </button>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label={isLogin ? "Sign in to your account" : "Create new account"}
                aria-busy={isLoading}
              >
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Sign in"
                    : "Create account"}
              </button>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center"></div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                {isLogin ? "New to the Pokémon Store? " : "Returning Trainer? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-bold text-yellow-400 hover:text-yellow-300"
                  aria-label={isLogin ? "Switch to registration form" : "Switch to sign in form"}
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        </main>

        {/* right side */}
        <aside
          className="hidden lg:block lg:w-1/2 bg-gray-900 relative overflow-hidden"
          aria-label="Marketing information"
        >
          <div
            className="absolute inset-0 bg-cover opacity-30"
            style={{ backgroundImage: "url(/abstract-card-art.jpg)" }}
            role="presentation"
            aria-hidden="true"
          ></div>
          <div className="absolute inset-0 bg-black opacity-60" aria-hidden="true"></div>

          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h2 className="text-4xl font-extrabold mb-4 text-yellow-400">
                Collect, Battle, Evolve
              </h2>
              <p className="text-lg opacity-90 mb-8 text-gray-300">
                The ultimate collection awaits. Start building your deck today!
              </p>
              <div className="flex justify-center gap-4" role="list" aria-label="Store statistics">
                <div
                  className="bg-gray-700 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border-l-4 border-yellow-400"
                  role="listitem"
                >
                  <p
                    className="text-4xl font-extrabold text-yellow-400"
                    aria-label="Over 1000 cards available"
                  >
                    1000+
                  </p>
                  <p className="text-sm text-gray-300">Cards Available</p>
                </div>
                <div
                  className="bg-gray-700 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border-l-4 border-yellow-400"
                  role="listitem"
                >
                  <p
                    className="text-4xl font-extrabold text-yellow-400"
                    aria-label="Over 500 happy customers"
                  >
                    500+
                  </p>
                  <p className="text-sm text-gray-300">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
