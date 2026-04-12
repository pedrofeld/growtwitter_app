import styled from "styled-components";

export const RegisterFormContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background:
    radial-gradient(circle at top left, rgba(29, 155, 240, 0.16), transparent 34%),
    radial-gradient(circle at bottom right, rgba(20, 131, 222, 0.12), transparent 28%),
    #f3f7fb;
`;

export const RegisterFormBox = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 40px 32px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px 48px rgba(15, 20, 25, 0.12);

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 20px;
  }
`;

export const RegisterFormTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 30px;
  line-height: 1.1;
  color: #0f1419;

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

export const RegisterFormText = styled.p`
  margin: 0 0 24px;
  color: #536471;
  font-size: 15px;
  line-height: 1.5;
`;

export const RegisterFormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RegisterFormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    color: #0f1419;
    font-size: 14px;
    font-weight: 700;
  }
`;

export const RegisterFormInput = styled.input`
  width: 100%;
  border: 1px solid #cfd9de;
  border-radius: 14px;
  padding: 13px 14px;
  font-size: 15px;
  color: #0f1419;
  background: #f7f9fa;

  &::placeholder {
    color: #536471;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #1d9bf0;
    box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.12);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const RegisterFormButton = styled.button`
  margin-top: 6px;
  border: none;
  border-radius: 999px;
  padding: 13px 18px;
  background: linear-gradient(135deg, #1d9bf0, #1483de);
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.02);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const RegisterFormLinkButton = styled.button`
  border: 1px solid #cfd9de;
  border-radius: 999px;
  padding: 13px 18px;
  background: #ffffff;
  color: #0f1419;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f7f9fa;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const RegisterFormError = styled.p`
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fdecef;
  color: #c62828;
  font-size: 14px;
  line-height: 1.4;
`;

export const RegisterFormMessage = styled.p`
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #eaf7ef;
  color: #177a3f;
  font-size: 14px;
  line-height: 1.4;
`;