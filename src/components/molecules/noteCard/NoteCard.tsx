import React, { useState } from 'react';
import axios from '../../../api/axiosInstance';
import { Note } from '../../../types/note';
import { Color } from '../../../types/color';
import { useNoteStore } from '../../../store/noteStore';

import styles from "./NoteCard.module.scss";

import ColorChip from "../../atoms/colorChip/ColorChip";

interface NoteCardProps {
	note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note: initialNote }) => {
	const [note, setNote] = useState<Note>(initialNote);
	const availableColors: Color[] = Object.values(Color);

	const deleteNote = useNoteStore((state) => state.deleteNote);

	// 삭제 버튼 핸들러
	const handleDelete = async () => {
		if (window.confirm(`"${note.title}" 메모를 정말 삭제하시겠습니까?`)) {
			try {
				await deleteNote(note.id);
				alert('메모가 삭제되었습니다.');
			} catch (error) {
				console.error("메모 삭제 실패:", error);
				alert('메모 삭제에 실패했습니다.');
			}
		}
	};

	const handleColorChange = async (newColor: Color) => {
		if (newColor === note.color) {
			return;
		}

		try {
			const response = await axios.patch(`/notes/${note.id}`, {
				color: newColor
			});

			const updatedNote: Note = response.data;

			setNote(updatedNote);
			console.log(`메모 ${note.id}의 색상이 ${newColor}로 변경되었습니다.`);

		} catch (error) {
			console.error("메모 색상 업데이트 실패:", error);
		}
	};

	return (
		<div className={styles.cardWrap}
			 style={{
				 border: `1px solid ${note.color}`,
				 backgroundColor: note.color,
			 }}>
			<h3>{note.title}</h3>
			<p>{note.content}</p>
			<button onClick={handleDelete} style={{
				backgroundColor: '#dc3545',
				color: 'white',
				border: 'none',
				padding: '5px 10px',
				borderRadius: '4px',
				cursor: 'pointer'
			}}>
				삭제
			</button>

			<hr />

			<h4>컬러칩 선택</h4>
			<div style={{display: 'flex', flexWrap: 'wrap'}}>
				{availableColors.map((colorCode: Color) => (
					<ColorChip
						key={colorCode}
						colorCode={colorCode}
						selectedColor={note.color as Color}
						onSelect={handleColorChange}
					/>
				))}
			</div>
		</div>
	);
};

export default NoteCard;