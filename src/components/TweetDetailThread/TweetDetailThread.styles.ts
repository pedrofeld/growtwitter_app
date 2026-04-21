import styled from "styled-components";

export const TweetDetailPageStyled = styled.section`
  display: flex;
  flex-direction: column;
`;

export const FocusedTweetSectionStyled = styled.div`
  border-bottom: 1px solid #e1e8ed;
  padding-bottom: 8px;
  margin-bottom: 6px;
`;

export const InlineReplyComposerStyled = styled.form`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 4px 16px;
  border-bottom: 1px solid #e1e8ed;
`;

export const ComposerAvatarStyled = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
`;

export const ComposerInputAreaStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ComposerTextareaStyled = styled.textarea`
  width: 100%;
  min-height: 52px;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 10px 12px;
  font: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1d9bf0;
    box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.14);
  }
`;

export const ComposerHintStyled = styled.span`
  font-size: 12px;
  color: #536471;
`;

export const ComposerSubmitButtonStyled = styled.button`
  border: none;
  background: #1d9bf0;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #1a8cd8;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ComposerErrorStyled = styled.p`
  margin: 0;
  color: #d93025;
  font-size: 13px;
`;

export const RepliesSectionStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
`;

export const RepliesTitleStyled = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #536471;
`;

export const ReplyItemStyled = styled.div`
  position: relative;
  padding-left: 14px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: #d6e9f8;
    border-radius: 999px;
  }
`;

export const DetailStateTextStyled = styled.p`
  margin: 12px 0;
  color: #536471;
`;

export const RetryButtonStyled = styled.button`
  border: 1px solid #d0d7de;
  background: #ffffff;
  color: #0f1419;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
`;