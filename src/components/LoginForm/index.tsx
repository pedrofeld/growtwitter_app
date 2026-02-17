/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/context/AuthContext";
import {
  LoginFormContainer,
  LoginFormBox,
  LoginFormError,
  LoginForm as StyledLoginForm,
  LoginFormGroup,
  LoginFormButton,
} from "./styles";

export const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: loginFunction } = useAuth();
  const navigate = useNavigate();

  /**
   * Login function:
   * 1. Prevents page reload
   * 2. Clears previous error
   * 3. Sets loading to true (to show "Logging in...")
   * 4. Calls login() from AuthContext with login (email or username) and password
   * 5. If success -> redirects to "/"
   * 6. If error -> shows error message
   * 7. Sets loading back to false (end of request)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginFunction(login, password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  return (
    <LoginFormContainer>
      <LoginFormBox>
        <h1>Login - GrowTwitter</h1>

        {/* Show error, if any */}
        {error && <LoginFormError>{error}</LoginFormError>}

        <StyledLoginForm onSubmit={handleSubmit}>
          {/* Email field */}
          <LoginFormGroup>
            <label htmlFor="email">Email:</label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="your@email.com or username"
              required
              disabled={loading}
            />
          </LoginFormGroup>

          {/* Password field */}
          <LoginFormGroup>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your password"
              required
              disabled={loading}
            />
          </LoginFormGroup>

          {/* Submit button */}
          <LoginFormButton type="submit" disabled={loading}>
            {loading ? "Loanding..." : "Login"}
          </LoginFormButton>
        </StyledLoginForm>
      </LoginFormBox>
    </LoginFormContainer>
  );
};
