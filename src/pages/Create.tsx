import { useState } from "react";
import { useNoteStore } from "../store/noteStore";
import { NewNote } from "../types/note"; // 💡 타입 임포트

export default function Create() {
	const addNote = useNoteStore((s) => s.addNote);
	const [title, setTitle] = useState("");
	// 💡 content 추가
	const [content, setContent] = useState("");

	const submit = () => {
		const newNote: NewNote = { // 💡 타입 지정
			title,
			content,
			color: "#fff",
		};
		addNote(newNote);
		setTitle("");
		setContent("");
		// 등록 후 Home 페이지로 이동하는 로직 추가 필요
		alert('메모가 등록되었습니다.');
	};

	return (
		<div>
			<input
				placeholder="제목"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<textarea
				placeholder="내용"
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<button onClick={submit} disabled={!title}>등록</button>
		</div>
	);
}