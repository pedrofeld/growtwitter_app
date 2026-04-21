import { type FormEvent } from "react";
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
} from "./RegisterForm.styles";

export type RegisterFormFieldKey =
  | "name"
  | "username"
  | "email"
  | "password"
  | "confirmPassword"
  | "profileImage";

interface RegisterFormProps {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  onFieldChange: (field: RegisterFormFieldKey, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBackToLogin: () => void;
}

export const RegisterForm = ({
  name,
  username,
  email,
  password,
  confirmPassword,
  profileImage,
  loading,
  error,
  success,
  onFieldChange,
  onSubmit,
  onBackToLogin,
}: RegisterFormProps) => {
  return (
    <RegisterFormContainer>
      <RegisterFormBox>
        <RegisterFormTitle>Create account</RegisterFormTitle>
        <RegisterFormText>Join GrowTwitter and start posting, replying, and following.</RegisterFormText>

        {error ? <RegisterFormError>{error}</RegisterFormError> : null}
        {success ? <RegisterFormMessage>{success}</RegisterFormMessage> : null}

        <RegisterFormStack onSubmit={onSubmit}>
          <RegisterFormField>
            <label htmlFor="name">Name</label>
            <RegisterFormInput
              id="name"
              type="text"
              value={name}
              onChange={(event) => onFieldChange("name", event.target.value)}
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
              onChange={(event) => onFieldChange("username", event.target.value)}
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
              onChange={(event) => onFieldChange("email", event.target.value)}
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
              onChange={(event) => onFieldChange("password", event.target.value)}
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
              onChange={(event) => onFieldChange("confirmPassword", event.target.value)}
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
              onChange={(event) => onFieldChange("profileImage", event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              disabled={loading}
            />
          </RegisterFormField>

          <RegisterFormButton type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </RegisterFormButton>

          <RegisterFormLinkButton type="button" onClick={onBackToLogin} disabled={loading}>
            Back to login
          </RegisterFormLinkButton>
        </RegisterFormStack>
      </RegisterFormBox>
    </RegisterFormContainer>
  );
};