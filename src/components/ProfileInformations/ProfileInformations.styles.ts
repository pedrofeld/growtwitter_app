import styled from "styled-components";

export const TabListStyled = styled.div`
	margin-top: 16px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	border-bottom: 1px solid #e1e8ed;
`;

export const TabButtonStyled = styled.button<{ $isActive: boolean }>`
	border: none;
	border-bottom: 3px solid ${({ $isActive }) => ($isActive ? "#1d9bf0" : "transparent")};
	background: transparent;
	padding: 14px 8px 12px;
	font-weight: 700;
	cursor: pointer;
`;

export const TweetsContainerStyled = styled.div`
	padding: 12px 16px 0;
`;

export const EmptyStateStyled = styled.p`
	opacity: 0.8;
`;
