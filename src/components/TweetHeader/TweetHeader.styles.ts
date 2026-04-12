import styled from "styled-components";

interface HeaderSizeProps {
  $isExpanded?: boolean;
}

export const TweetHeaderStyled = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AuthorInlineStyled = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const AuthorNameStyled = styled.strong<HeaderSizeProps>`
  font-size: ${({ $isExpanded }) => ($isExpanded ? "16px" : "14px")};
  font-weight: 700;
`;

export const AuthorHandleStyled = styled.span<HeaderSizeProps>`
  font-size: ${({ $isExpanded }) => ($isExpanded ? "14px" : "13px")};
  opacity: 0.8;
`;

export const TweetTimeStyled = styled.span<HeaderSizeProps>`
  margin-left: auto;
  font-size: ${({ $isExpanded }) => ($isExpanded ? "13px" : "12px")};
  opacity: 0.75;
`;
