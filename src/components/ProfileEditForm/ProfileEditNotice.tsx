import React from "react";
import { ProfileEditFormContainer, ProfileEditMessage } from "./ProfileEditForm.styles";

export interface ProfileEditNoticeProps {
    message: string;
    type?: "success" | "error";
}

export const ProfileEditNotice: React.FC<ProfileEditNoticeProps> = ({ message, type = "success" }) => {
    return (
        <ProfileEditFormContainer as="div">
            <ProfileEditMessage $type={type}>{message}</ProfileEditMessage>
        </ProfileEditFormContainer>
    );
};

export default ProfileEditNotice;
