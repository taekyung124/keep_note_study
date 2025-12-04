// src/components/notes/NoteCard.tsx
import React from 'react';
import { Note } from '../../types/note';
import { useNoteStore } from '../../store/noteStore';

// NoteCard가 받을 Props의 타입을 정의합니다.
interface NoteCardProps {
	note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
	// 스토어에서 deleteNote 액션만 가져옵니다.
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

	return (
		// 스타일을 위한 인라인 스타일 (CSS-in-JS 환경에서는 적절히 변경)
		<div style={{
			border: `1px solid ${note.color}`,
			padding: '15px',
			margin: '10px 0',
			borderRadius: '8px',
			backgroundColor: note.color, // 배경색 적용
			width: '300px'
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
		</div>
	);
};

export default NoteCard;