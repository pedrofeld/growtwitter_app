import styled from "styled-components";

export const LoginFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

export const LoginFormBox = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 24px;
  }
`;

export const LoginFormError = styled.p`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const LoginFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1da1f2;
      box-shadow: 0 0 4px rgba(29, 161, 242, 0.25);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      color: #999;
    }
  }
`;

export const LoginFormButton = styled.button`
  padding: 12px;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background-color: #1a91da;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
