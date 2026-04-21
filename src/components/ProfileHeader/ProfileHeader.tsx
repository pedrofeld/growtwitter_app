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
import { resolveAvatarUrl } from "../../utils/avatar";

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
	onEditProfileToggle?: () => void;
	isEditingProfile?: boolean;
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
	onEditProfileToggle,
	isEditingProfile,
	actionMessage,
}: ProfileHeaderProps) => {
	return (
		<HeaderContainerStyled>
			<CoverImageStyled />
			<ProfileAvatarStyled src={resolveAvatarUrl(profileImage)} alt={`Foto de ${username}`} />
			<ProfileTopRowStyled>
				<ProfileIdentityStyled>
					<ProfileNameStyled>{name}</ProfileNameStyled>
					<ProfileUsernameStyled>@{username}</ProfileUsernameStyled>
				</ProfileIdentityStyled>
				{isOwnProfile && onEditProfileToggle ? (
					<ProfileActionButtonStyled
						type="button"
						$isFollowing={false}
						onClick={onEditProfileToggle}
					>
						{isEditingProfile ? "Close editor" : "Edit profile"}
					</ProfileActionButtonStyled>
				) : null}
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
