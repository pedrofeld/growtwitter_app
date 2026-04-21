import styled from "styled-components";

export const ExploreRootStyled = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SearchFormStyled = styled.form`
  display: flex;
`;

export const SearchInputStyled = styled.input`
  width: 100%;
  border: 1px solid var(--app-input-border);
  border-radius: 999px;
  padding: 12px 16px;
  font-size: 15px;
  background: var(--app-input-bg);
  color: var(--app-input-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &::placeholder {
    color: var(--app-input-placeholder);
  }

  &:focus {
    outline: none;
    border-color: var(--app-accent);
    box-shadow: 0 0 0 3px var(--app-focus-ring);
    background: var(--app-surface);
  }
`;

export const TabsRowStyled = styled.div`
  display: flex;
  border-bottom: 1px solid var(--app-border);
`;

export const TabButtonStyled = styled.button<{ $isActive: boolean }>`
  flex: 1;
  border: 0;
  border-bottom: 2px solid ${({ $isActive }) => ($isActive ? "var(--app-accent)" : "transparent")};
  background: transparent;
  color: ${({ $isActive }) => ($isActive ? "var(--app-selected-text)" : "var(--app-text-muted)")};
  font-size: 15px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 600)};
  padding: 14px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: ${({ $isActive }) => ($isActive ? "var(--app-selected-surface)" : "var(--app-hover-surface)")};
  }
`;

export const StateTextStyled = styled.p`
  color: var(--app-text-muted);
  font-size: 14px;
`;

export const UserResultsListStyled = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const UserResultItemStyled = styled.li`
  border-bottom: 1px solid var(--app-border);
`;

export const UserResultCardStyled = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--app-hover-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--app-focus-ring);
    outline-offset: 2px;
  }
`;

export const UserAvatarStyled = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--app-border);
`;

export const UserNameStyled = styled.p`
  color: var(--app-text);
  font-size: 15px;
  font-weight: 700;
`;

export const UserUsernameStyled = styled.p`
  color: var(--app-text-muted);
  font-size: 14px;
`;