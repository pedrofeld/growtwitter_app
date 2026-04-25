import styled from "styled-components";
import { media } from "../../config/styles/breakpoints";

export const TabListStyled = styled.div`
	margin-top: 16px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	border-bottom: 1px solid var(--app-border);
`;

export const TabButtonStyled = styled.button<{ $isActive: boolean }>`
	border: none;
	border-bottom: 3px solid ${({ $isActive }) => ($isActive ? "var(--app-accent)" : "transparent")};
	background: transparent;
	color: ${({ $isActive }) => ($isActive ? "var(--app-selected-text)" : "var(--app-text-muted)")};
	padding: 14px 8px 12px;
	min-height: 44px;
	font-weight: 700;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

	&:hover {
		background: ${({ $isActive }) => ($isActive ? "var(--app-selected-surface)" : "var(--app-hover-surface)")};
	}
`;

export const TweetsContainerStyled = styled.div`
	padding: 12px 16px 0;

	${media.mobile} {
		padding: 10px 12px 0;
	}
`;

export const EmptyStateStyled = styled.p`
	color: var(--app-text-muted);
`;
