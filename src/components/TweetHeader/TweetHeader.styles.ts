import styled from "styled-components";

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

export const AuthorNameStyled = styled.strong`
  font-size: 14px;
  font-weight: 700;
`;

export const AuthorHandleStyled = styled.span`
  font-size: 13px;
  opacity: 0.8;
`;

export const TweetTimeStyled = styled.span`
  margin-left: auto;
  font-size: 12px;
  opacity: 0.75;
`;
