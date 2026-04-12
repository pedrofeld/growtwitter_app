import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import userService from "../config/services/user.service";
import { useAuth } from "../config/context/AuthContext";
import {
  RegisterFormBox,
  RegisterFormButton,
  RegisterFormContainer,
  RegisterFormError,
  RegisterFormField,
  RegisterFormInput,
  RegisterFormLinkButton,
  RegisterFormMessage,
  RegisterFormStack,
  RegisterFormText,
  RegisterFormTitle,
} from "./Register.styles";

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
    <RegisterFormContainer>
      <RegisterFormBox>
        <RegisterFormTitle>Create account</RegisterFormTitle>
        <RegisterFormText>Join GrowTwitter and start posting, replying, and following.</RegisterFormText>

        {error ? <RegisterFormError>{error}</RegisterFormError> : null}
        {success ? <RegisterFormMessage>{success}</RegisterFormMessage> : null}

        <RegisterFormStack onSubmit={handleSubmit}>
          <RegisterFormField>
            <label htmlFor="name">Name</label>
            <RegisterFormInput
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              required
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormField>
            <label htmlFor="username">Username</label>
            <RegisterFormInput
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="yourusername"
              required
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormField>
            <label htmlFor="email">Email</label>
            <RegisterFormInput
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormField>
            <label htmlFor="password">Password</label>
            <RegisterFormInput
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormField>
            <label htmlFor="confirmPassword">Confirm password</label>
            <RegisterFormInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your password"
              required
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormField>
            <label htmlFor="profileImage">Profile image URL</label>
            <RegisterFormInput
              id="profileImage"
              type="url"
              value={profileImage}
              onChange={(event) => setProfileImage(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormButton type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </RegisterFormButton>

          <RegisterFormLinkButton type="button" onClick={() => navigate("/login")} disabled={loading}>
            Back to login
          </RegisterFormLinkButton>
        </RegisterFormStack>
      </RegisterFormBox>
    </RegisterFormContainer>
  );
};
