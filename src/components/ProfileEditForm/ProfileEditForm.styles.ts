import styled from "styled-components";

export const ProfileEditFormContainer = styled.form`
    margin: 16px;
    padding: 16px;
    border: 1px solid var(--app-border);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--app-surface);
    color: var(--app-text);
`;

export const ProfileEditField = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--app-text);
`;

export const ProfileEditInput = styled.input`
    border: 1px solid var(--app-input-border);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    background: var(--app-input-bg);
    color: var(--app-input-text);

    &::placeholder {
        color: var(--app-input-placeholder);
    }

    &:focus {
        outline: 2px solid var(--app-focus-ring);
        outline-offset: 0;
        border-color: var(--app-accent);
    }
`;

export const ProfileEditActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

export const ProfileEditButton = styled.button<{ $variant: "primary" | "secondary" }>`
    border-radius: 999px;
    border: 1px solid ${({ $variant }) => ($variant === "primary" ? "var(--app-accent)" : "var(--app-button-secondary-border)")};
    background: ${({ $variant }) => ($variant === "primary" ? "var(--app-accent)" : "var(--app-button-secondary-bg)")};
    color: ${({ $variant }) => ($variant === "primary" ? "var(--app-button-primary-text)" : "var(--app-button-secondary-text)")};
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
        background: ${({ $variant }) => ($variant === "primary" ? "var(--app-accent-hover)" : "var(--app-button-secondary-hover-bg)")};
        border-color: ${({ $variant }) => ($variant === "primary" ? "var(--app-accent-hover)" : "var(--app-button-secondary-hover-border)")};
    }

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

export const ProfileEditMessage = styled.p<{ $type: "error" | "success" }>`
    margin: 0;
    font-size: 13px;
    line-height: 1.35;
    color: ${({ $type }) => ($type === "error" ? "var(--app-danger)" : "var(--app-success)")};
`;
