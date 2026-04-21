import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import userService from "../config/services/user.service";
import { useAuth } from "../config/context/AuthContext";
import { RegisterForm, type RegisterFormFieldKey } from "../components/RegisterForm/RegisterForm";

function isValidHttpUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function getFriendlyRegisterError(message: string | undefined): string {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (normalizedMessage.includes("email") && (normalizedMessage.includes("exists") || normalizedMessage.includes("already"))) {
    return "This email is already registered. Try another one or log in instead.";
  }

  if (normalizedMessage.includes("username") && (normalizedMessage.includes("exists") || normalizedMessage.includes("already"))) {
    return "This username is already in use. Please choose another one.";
  }

  if (normalizedMessage.includes("password")) {
    return "Please check your password and try again.";
  }

  return message?.trim() || "Could not create your account. Please try again.";
}

function normalizeResponseMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const response = data as { message?: string; data?: { message?: string } };
  return response.message ?? response.data?.message;
}

export const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim();
    const normalizedProfileImage = profileImage.trim();

    if (!normalizedName || !normalizedUsername || !normalizedEmail || !password) {
      setError("Please fill in all required fields.");
      setSuccess(null);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setSuccess(null);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess(null);
      return;
    }

    if (normalizedProfileImage && !isValidHttpUrl(normalizedProfileImage)) {
      setError("Please provide a valid profile image URL.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.register(
        normalizedName,
        normalizedUsername,
        normalizedEmail,
        password,
        normalizedProfileImage || undefined,
      );

      if (!response.ok) {
        setError(getFriendlyRegisterError(normalizeResponseMessage(response) ?? response.message));
        return;
      }

      setSuccess("Account created successfully. You can now log in.");
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setProfileImage("");
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterForm
      name={name}
      username={username}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      profileImage={profileImage}
      loading={loading}
      error={error}
      success={success}
      onFieldChange={(field, value) => {
        const setters: Record<RegisterFormFieldKey, (nextValue: string) => void> = {
          name: setName,
          username: setUsername,
          email: setEmail,
          password: setPassword,
          confirmPassword: setConfirmPassword,
          profileImage: setProfileImage,
        };

        setters[field](value);
      }}
      onSubmit={handleSubmit}
      onBackToLogin={() => navigate("/login")}
    />
  );
};
