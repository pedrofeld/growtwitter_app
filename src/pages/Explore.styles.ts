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
  border: 1px solid #cfd9de;
  border-radius: 999px;
  padding: 12px 16px;
  font-size: 15px;
  background: #f7f9fa;
  color: #0f1419;

  &::placeholder {
    color: #536471;
  }

  &:focus {
    outline: none;
    border-color: #1d9bf0;
    box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.12);
    background: #ffffff;
  }
`;

export const TabsRowStyled = styled.div`
  display: flex;
  border-bottom: 1px solid #e6ecf0;
`;

export const TabButtonStyled = styled.button<{ $isActive: boolean }>`
  flex: 1;
  border: 0;
  border-bottom: 2px solid ${({ $isActive }) => ($isActive ? "#1d9bf0" : "transparent")};
  background: transparent;
  color: ${({ $isActive }) => ($isActive ? "#0f1419" : "#536471")};
  font-size: 15px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 600)};
  padding: 14px 12px;
  cursor: pointer;

  &:hover {
    background: #f7f9fa;
  }
`;

export const StateTextStyled = styled.p`
  color: #536471;
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
  border-bottom: 1px solid #e6ecf0;
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

  &:hover {
    background: #f7f9fa;
  }

  &:focus-visible {
    outline: 2px solid #1d9bf0;
    outline-offset: 2px;
  }
`;

export const UserAvatarStyled = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #d9d9d9;
`;

export const UserNameStyled = styled.p`
  color: #0f1419;
  font-size: 15px;
  font-weight: 700;
`;

export const UserUsernameStyled = styled.p`
  color: #536471;
  font-size: 14px;
`;
