import styled from "styled-components";

export const TweetCardStyled = styled.article`
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 12px;

  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

export const TweetBodyLayoutStyled = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const ProfileImageStyled = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const TweetMainContentStyled = styled.div`
  width: 100%;
  min-width: 0;
`;

export const TweetContentStyled = styled.p`
  margin: 8px 0 12px;
  white-space: pre-wrap;
  line-height: 1.4;
`;

export const MetaRowStyled = styled.footer`
  display: flex;
  gap: 16px;
`;

export const MetricStyled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.9;
  cursor: pointer;
`;

export const LikeButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.9;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;
`;

export const ReplyTagStyled = styled.small`
  display: inline-block;
  margin-top: 6px;
  margin-bottom: 6px;
  opacity: 0.75;
`;
