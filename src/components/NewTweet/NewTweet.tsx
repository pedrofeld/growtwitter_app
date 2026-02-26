import { useState } from "react";
import {
	ModalBackdropStyled,
	ModalCardStyled,
	ModalCloseButtonStyled,
	ModalFooterStyled,
	ModalHeaderStyled,
	ModalSubmitButtonStyled,
	ModalTextareaStyled,
	ModalTitleStyled,
} from "./NewTweet.styles";

interface NewTweetProps {
	isOpen: boolean;
	onClose: () => void;
	themeMode: "light" | "dark";
}

export const NewTweet = ({ isOpen, onClose, themeMode }: NewTweetProps) => {
	const [tweetContent, setTweetContent] = useState("");

	if (!isOpen) {
		return null;
	}

	const handleSubmit = () => {
		setTweetContent("");
		onClose();
	};

	return (
		<ModalBackdropStyled onClick={onClose}>
			<ModalCardStyled $themeMode={themeMode} onClick={(event) => event.stopPropagation()}>
				<ModalHeaderStyled>
					<ModalTitleStyled>Novo tweet</ModalTitleStyled>
					<ModalCloseButtonStyled type="button" onClick={onClose} aria-label="Fechar">
						×
					</ModalCloseButtonStyled>
				</ModalHeaderStyled>

				<ModalTextareaStyled
					$themeMode={themeMode}
					placeholder="O que está acontecendo?"
					value={tweetContent}
					onChange={(event) => setTweetContent(event.target.value)}
					maxLength={280}
				/>

				<ModalFooterStyled>
					<ModalSubmitButtonStyled
						type="button"
						$themeMode={themeMode}
						onClick={handleSubmit}
						disabled={!tweetContent.trim()}
					>
						Tweetar
					</ModalSubmitButtonStyled>
				</ModalFooterStyled>
			</ModalCardStyled>
		</ModalBackdropStyled>
	);
};
