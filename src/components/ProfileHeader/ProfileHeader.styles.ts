import styled from "styled-components";

export const HeaderContainerStyled = styled.section`
	width: 100%;
`;

export const CoverImageStyled = styled.div`
	height: 180px;
	background: linear-gradient(135deg, #4f8cc9, #1d9bf0);
`;

export const ProfileAvatarStyled = styled.img`
	width: 120px;
	height: 120px;
	object-fit: cover;
	border-radius: 999px;
	border: 4px solid #ffffff;
	margin-top: -60px;
	margin-left: 16px;
	background: #d9d9d9;
`;

export const ProfileNameStyled = styled.h1`
	margin: 12px 16px 0;
	font-size: 22px;
	font-weight: 800;
`;

export const ProfileUsernameStyled = styled.p`
	margin: 4px 16px 0;
	opacity: 0.8;
`;

export const ProfileMetaStyled = styled.p`
	margin: 12px 16px 0;
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
