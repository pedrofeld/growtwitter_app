import {
	CoverImageStyled,
	HeaderContainerStyled,
	ProfileAvatarStyled,
	ProfileActionButtonStyled,
	ProfileActionMessageStyled,
	ProfileActionStackStyled,
	ProfileIdentityStyled,
	ProfileMetaStyled,
	ProfileNameStyled,
	ProfileStatsStyled,
	ProfileUsernameStyled,
	ProfileTopRowStyled,
} from "./ProfileHeader.styles";

interface ProfileHeaderProps {
	name: string;
	username: string;
	profileImage: string;
	joinedAt: string;
	followingCount: number;
	followersCount: number;
	isOwnProfile: boolean;
	isFollowing: boolean;
	isFollowActionLoading?: boolean;
	onFollowToggle?: () => void;
	actionMessage?: string | null;
}

export const ProfileHeader = ({
	name,
	username,
	profileImage,
	joinedAt,
	followingCount,
	followersCount,
	isOwnProfile,
	isFollowing,
	isFollowActionLoading,
	onFollowToggle,
	actionMessage,
}: ProfileHeaderProps) => {
	return (
		<HeaderContainerStyled>
			<CoverImageStyled />
			<ProfileAvatarStyled src={profileImage} alt={`Foto de ${username}`} />
			<ProfileTopRowStyled>
				<ProfileIdentityStyled>
					<ProfileNameStyled>{name}</ProfileNameStyled>
					<ProfileUsernameStyled>@{username}</ProfileUsernameStyled>
				</ProfileIdentityStyled>
				{!isOwnProfile && onFollowToggle ? (
					<ProfileActionStackStyled>
						<ProfileActionButtonStyled
							type="button"
							$isFollowing={isFollowing}
							onClick={onFollowToggle}
							disabled={isFollowActionLoading}
						>
							{isFollowing ? "Unfollow" : "Follow"}
						</ProfileActionButtonStyled>
						{actionMessage ? <ProfileActionMessageStyled>{actionMessage}</ProfileActionMessageStyled> : null}
					</ProfileActionStackStyled>
				) : null}
			</ProfileTopRowStyled>
			<ProfileMetaStyled>Joined at {joinedAt}</ProfileMetaStyled>
			<ProfileStatsStyled>
				<strong>{followingCount}</strong> following · <strong>{followersCount}</strong> followers
			</ProfileStatsStyled>
		</HeaderContainerStyled>
	);
};
