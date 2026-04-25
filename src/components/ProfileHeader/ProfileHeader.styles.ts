import styled from "styled-components";
import { media } from "../../config/styles/breakpoints";

export const HeaderContainerStyled = styled.section`
	width: 100%;
`;

export const ProfileTopRowStyled = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin: 12px 16px 0;

	${media.mobile} {
		margin: 12px 12px 0;
		gap: 10px;
	}
`;

export const ProfileIdentityStyled = styled.div`
	min-width: 0;
`;

export const ProfileActionStackStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8px;
`;

export const CoverImageStyled = styled.div`
	height: 180px;
	background: linear-gradient(135deg, var(--app-accent), #4f8cc9);

	${media.mobile} {
		height: 140px;
	}
`;

export const ProfileAvatarStyled = styled.img`
	width: 120px;
	height: 120px;
	aspect-ratio: 1 / 1;
	display: block;
	object-fit: cover;
	border-radius: 50%;
	border: 4px solid var(--app-avatar-border);
	margin-top: -60px;
	margin-left: 16px;
	background: var(--app-border);

	${media.mobile} {
		width: 88px;
		height: 88px;
		margin-top: -44px;
		margin-left: 12px;
		border-width: 3px;
	}
`;

export const ProfileNameStyled = styled.h1`
	margin: 0;
	font-size: 22px;
	font-weight: 800;
	color: var(--app-text);

	${media.mobile} {
		font-size: 20px;
	}
`;

export const ProfileUsernameStyled = styled.p`
	margin: 4px 0 0;
	color: var(--app-text-muted);
`;

interface ProfileActionButtonStyledProps {
	$isFollowing: boolean;
}

export const ProfileActionButtonStyled = styled.button<ProfileActionButtonStyledProps>`
	border: 1px solid ${({ $isFollowing }) => ($isFollowing ? "var(--app-button-secondary-border)" : "var(--app-accent)")};
	background: ${({ $isFollowing }) => ($isFollowing ? "var(--app-button-secondary-bg)" : "var(--app-accent)")};
	color: ${({ $isFollowing }) => ($isFollowing ? "var(--app-button-secondary-text)" : "var(--app-button-primary-text)")};
	border-radius: 999px;
	padding: 10px 18px;
	min-height: 42px;
	font-size: 14px;
	font-weight: 700;
	line-height: 1;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

	&:hover:not(:disabled) {
		background: ${({ $isFollowing }) => ($isFollowing ? "var(--app-button-secondary-hover-bg)" : "var(--app-accent-hover)")};
		border-color: ${({ $isFollowing }) => ($isFollowing ? "var(--app-button-secondary-hover-border)" : "var(--app-accent-hover)")};
	}

	&:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}
`;

export const ProfileActionMessageStyled = styled.p`
	margin: 0;
	font-size: 13px;
	line-height: 1.35;
	color: var(--app-danger);
	max-width: 240px;
	text-align: right;
`;

export const ProfileMetaStyled = styled.p`
	margin: 12px 16px 0;
	color: var(--app-text-muted);
	font-size: 14px;
	${media.mobile} {
		margin: 10px 12px 0;
	}
`;

export const ProfileStatsStyled = styled.p`
	margin: 12px 16px 0;
	font-size: 14px;
	color: var(--app-text-muted);

	${media.mobile} {
		margin: 10px 12px 0;
	}

	strong {
		font-weight: 700;
		color: var(--app-text);
	}
`;
