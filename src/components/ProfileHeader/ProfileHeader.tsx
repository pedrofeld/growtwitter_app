import {
	CoverImageStyled,
	HeaderContainerStyled,
	ProfileAvatarStyled,
	ProfileMetaStyled,
	ProfileNameStyled,
	ProfileStatsStyled,
	ProfileUsernameStyled,
} from "./ProfileHeader.styles";

interface ProfileHeaderProps {
	name: string;
	username: string;
	profileImage: string;
	joinedAt: string;
	followingCount: number;
	followersCount: number;
}

export const ProfileHeader = ({
	name,
	username,
	profileImage,
	joinedAt,
	followingCount,
	followersCount,
}: ProfileHeaderProps) => {
	return (
		<HeaderContainerStyled>
			<CoverImageStyled />
			<ProfileAvatarStyled src={profileImage} alt={`Foto de ${username}`} />
			<ProfileNameStyled>{name}</ProfileNameStyled>
			<ProfileUsernameStyled>@{username}</ProfileUsernameStyled>
			<ProfileMetaStyled>Joined at {joinedAt}</ProfileMetaStyled>
			<ProfileStatsStyled>
				<strong>{followingCount}</strong> following · <strong>{followersCount}</strong> followers
			</ProfileStatsStyled>
		</HeaderContainerStyled>
	);
};
