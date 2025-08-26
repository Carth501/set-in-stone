import { useState } from "react";
import {
  authService,
  type LoginCredentials,
  type RegisterCredentials,
} from "../utils/authService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
        } as LoginCredentials);

        if (response) {
          onLoginSuccess(response.user);
          onClose();
        }
      } else {
        const response = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        } as RegisterCredentials);

        if (response) {
          // After registration, automatically log them in
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password,
          });

          if (loginResponse) {
            onLoginSuccess(loginResponse.user);
            onClose();
          }
        }
      }
    } catch (error: unknown) {
      setError((error as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-700 rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-600 hover:underline"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
