import styled from "styled-components";

export const HeaderContainerStyled = styled.section`
	width: 100%;
`;

export const ProfileTopRowStyled = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin: 12px 16px 0;
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
	background: linear-gradient(135deg, #4f8cc9, #1d9bf0);
`;

export const ProfileAvatarStyled = styled.img`
	width: 120px;
	height: 120px;
	aspect-ratio: 1 / 1;
	display: block;
	object-fit: cover;
	border-radius: 50%;
	border: 4px solid #ffffff;
	margin-top: -60px;
	margin-left: 16px;
	background: #d9d9d9;
`;

export const ProfileNameStyled = styled.h1`
	margin: 0;
	font-size: 22px;
	font-weight: 800;
`;

export const ProfileUsernameStyled = styled.p`
	margin: 4px 0 0;
	opacity: 0.8;
`;

interface ProfileActionButtonStyledProps {
	$isFollowing: boolean;
}

export const ProfileActionButtonStyled = styled.button<ProfileActionButtonStyledProps>`
	border: 1px solid ${({ $isFollowing }) => ($isFollowing ? "#cfd9de" : "#1d9bf0")};
	background: ${({ $isFollowing }) => ($isFollowing ? "#ffffff" : "#1d9bf0")};
	color: ${({ $isFollowing }) => ($isFollowing ? "#0f1419" : "#ffffff")};
	border-radius: 999px;
	padding: 10px 18px;
	font-size: 14px;
	font-weight: 700;
	line-height: 1;
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

	&:hover:not(:disabled) {
		background: ${({ $isFollowing }) => ($isFollowing ? "#f7f9f9" : "#1a8cd8")};
		border-color: ${({ $isFollowing }) => ($isFollowing ? "#bfc8cf" : "#1a8cd8")};
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
	color: #e0245e;
	max-width: 240px;
	text-align: right;
`;

export const ProfileMetaStyled = styled.p`
	margin: 12px 0 0;
	opacity: 0.8;
	font-size: 14px;
`;

export const ProfileStatsStyled = styled.p`
	margin: 12px 16px 0;
	font-size: 14px;

	strong {
		font-weight: 700;
	}
`;
