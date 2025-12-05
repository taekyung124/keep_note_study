import { useEffect } from "react";
import { useNoteStore } from "../store/noteStore";
import {Note} from "../types/note";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import NoteForm from "../components/molecules/noteForm/NoteForm";

export default function Memo() {
	const { notes, fetchNotes } = useNoteStore();

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]); // 💡 ESLint 경고 방지를 위해 fetchNotes를 의존성 배열에 추가

	return (
		<div>
			<NoteForm />
			<h2>메모 리스트</h2>
			{notes.length === 0 ? (
				<p>메모가 없습니다. 새로 작성해 보세요.</p>
			) : (
				notes.map((note:Note) => (
					<NoteCard key={note.id} note={note} />
				))
			)}
		</div>
	);
}