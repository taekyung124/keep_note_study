import React, { useState } from 'react';
import { useNoteStore } from '../../../store/noteStore';
import { NewNote } from '../../../types/note';
import { Color } from '../../../types/color'

const NoteForm: React.FC = () => {
	// 💡 useNoteStore에서 addNote 액션만 가져옵니다.
	const addNote = useNoteStore((state) => state.addNote);

	// 💡 새 메모 작성을 위한 상태를 정의합니다.
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	// 💡 메모 추가 핸들러 함수
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			alert("제목과 내용을 모두 입력해 주세요.");
			return;
		}

		const newNote: NewNote = {
			title: title.trim(),
			content: content.trim(),
			color: Color.TRANSPARENT, // 기본 색상 지정
		};

		try {
			await addNote(newNote);
			// 성공 후 입력 필드 초기화
			setTitle("");
			setContent("");
		} catch (error) {
			console.error("메모 추가 실패:", error);
			alert("메모 추가에 실패했습니다.");
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px' }}>
			<h2>새 메모 작성</h2>
			<div style={{ marginBottom: '10px' }}>
				<input
					type="text"
					placeholder="제목을 입력하세요"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
				/>
			</div>
			<div style={{ marginBottom: '10px' }}>
                <textarea
					placeholder="내용을 입력하세요"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={4}
					style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
				/>
			</div>
			<button
				type="submit"
				disabled={!title.trim() || !content.trim()}
				style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
			>
				메모 추가
			</button>
		</form>
	);
};

export default NoteForm;