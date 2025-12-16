import { useEffect } from "react";
import { useNoteStore } from "../store/noteStore";
import {Note} from "../types/note";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import NoteForm from "../components/molecules/noteForm/NoteForm";
import SearchForm from "../components/molecules/searchForm/SearchForm";

export default function Memo() {
	const { notes, fetchNotes, loading, error, _hasHydrated } = useNoteStore();

	useEffect(() => {
		if (_hasHydrated) {
			fetchNotes();
		}
	}, [fetchNotes, _hasHydrated]);

	if (!_hasHydrated) {
		return <div>로컬 저장소에서 데이터를 불러오는 중...</div>;
	}

	return (
		<div>
			<SearchForm />
			<NoteForm />
			<h2>메모 리스트</h2>
			{error && <p style={{color: 'red'}}>오류 발생: {error}</p>}
			{loading ? (
				<p>메모를 불러오는 중입니다...</p>
			) : notes.length === 0 ? (
				<p>메모가 없습니다. 새로 작성해 보세요.</p>
			) : (
				<div style={{
					position: "relative",
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
					width: "100%",
					alignItems: "start",
					justifyContent: "start",
				}}>
					{notes.map((note: Note) => (<NoteCard key={note.id} note={note} />))}
				</div>
			)}
		</div>
	);
}