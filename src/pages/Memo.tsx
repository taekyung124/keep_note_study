import {useEffect, useState} from "react";
import { useNoteStore } from "../store/noteStore";
import {Note} from "../types/note";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import NoteForm from "../components/molecules/noteForm/NoteForm";
import SearchFilter from "../components/molecules/searchFilter/SearchFilter";
import Header from "../components/organisms/header/Header";
import Navigation from "../components/organisms/navigation/Navigation";
import PopNote from "../components/molecules/popNote/PopNote";

export default function Memo() {
	const { notes, fetchNotes, loading, error, _hasHydrated } = useNoteStore();

	// 편집중인 메모 상태
	const [editingNote, setEditingNote] = useState<Note | null>(null);

	useEffect(() => {
		if (_hasHydrated) {
			fetchNotes();
		}
	}, [fetchNotes, _hasHydrated]);

	if (!_hasHydrated) {
		return <div>로컬 저장소에서 데이터를 불러오는 중...</div>;
	}

	// 고정 메모 구분
	const fixedNotes = notes.filter(note => note.isFixed);
	const normalNotes = notes.filter(note => !note.isFixed);

	const handleEditClick = (note: Note) => {
		setEditingNote(note);
	}

	const handleClosePopNote = () => {
		setEditingNote(null)
	}

	return (
		<div style={{ position: "relative", paddingTop: "70px" }}>
			<Header title={'Keep'} />
			<Navigation />
			<SearchFilter notes={notes} />
			<NoteForm />
			<h2>고정 메모 리스트</h2>
			{loading ? (
				<p>고정된 메모를 불러오는 중입니다...</p>
			) : fixedNotes.length === 0 ? (
				<p>고정된 메모가 없습니다. 새로 작성해 보세요.</p>
			) : (
				<div style={{
					position: "relative",
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
					width: "100%",
					maxWidth: 960,
					margin: "0 auto",
					alignItems: "start",
					justifyContent: "start",
				}}>
					{fixedNotes.map((note) => (
						<NoteCard key={note.id} note={note} onEditClick={handleEditClick} />
					))}
				</div>
			)}

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
					maxWidth: 960,
					margin: "0 auto",
					alignItems: "start",
					justifyContent: "start",
				}}>
					{normalNotes.map((note: Note) => (<NoteCard key={note.id} note={note} onEditClick={handleEditClick} />))}
				</div>
			)};
			{editingNote && (
				<PopNote
					note={editingNote}
					onClose={handleClosePopNote}
				/>
			)}
		</div>
	);
}