import React from "react";
import {
    ProfileEditFormContainer,
    ProfileEditField,
    ProfileEditInput,
    ProfileEditActions,
    ProfileEditButton,
    ProfileEditMessage,
} from "./ProfileEditForm.styles";

export interface ProfileEditFormState {
    name: string;
    username: string;
    profileImage: string;
}

export interface ProfileEditFormProps {
    form: ProfileEditFormState;
    onChange: (field: keyof ProfileEditFormState, value: string) => void;
    onCancel: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isUpdating?: boolean;
    error?: string | null;
    success?: string | null;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    form,
    onChange,
    onCancel,
    onSubmit,
    isUpdating = false,
    error,
    success,
}) => {
    return (
        <ProfileEditFormContainer onSubmit={onSubmit}>
            <ProfileEditField>
                Name
                <ProfileEditInput
                    type="text"
                    value={form.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                    required
                />
            </ProfileEditField>

            <ProfileEditField>
                Username
                <ProfileEditInput
                    type="text"
                    value={form.username}
                    onChange={(event) => onChange("username", event.target.value)}
                    placeholder="yourusername"
                    maxLength={30}
                    required
                />
            </ProfileEditField>

            <ProfileEditField>
                Profile image URL
                <ProfileEditInput
                    type="url"
                    value={form.profileImage}
                    onChange={(event) => onChange("profileImage", event.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                />
            </ProfileEditField>

            {error ? <ProfileEditMessage $type="error">{error}</ProfileEditMessage> : null}
            {success ? <ProfileEditMessage $type="success">{success}</ProfileEditMessage> : null}

            <ProfileEditActions>
                <ProfileEditButton type="button" $variant="secondary" onClick={onCancel} disabled={isUpdating}>
                    Cancel
                </ProfileEditButton>
                <ProfileEditButton type="submit" $variant="primary" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save changes"}
                </ProfileEditButton>
            </ProfileEditActions>
        </ProfileEditFormContainer>
    );
};

export default ProfileEditForm;
