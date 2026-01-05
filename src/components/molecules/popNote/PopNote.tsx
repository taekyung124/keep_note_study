import React from 'react';
import styles from './PopNote.module.scss';
import NoteForm from "../noteForm/NoteForm";
import {Note} from "../../../types/note";

interface PopNoteProps {
	note: Note;
	onClose: () => void;
}

const PopNote: React.FC<PopNoteProps> = ({ note, onClose}) => {
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.popNote} onClick={(e) => e.stopPropagation()}>
				<NoteForm initialData={note} onSuccess={onClose} />
			</div>
		</div>
	)
};
export default PopNote;