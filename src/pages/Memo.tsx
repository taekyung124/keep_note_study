import {useEffect, useState} from "react";
import { useNoteStore } from "../store/noteStore";
import {Note} from "../types/note";
import Layout from "../components/templates/layout/Layout";
import StatusNotice from "../components/molecules/statusNotice/StatusNotice";
import MasonryList from "../components/molecules/masonryList/MasonryList";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import NoteForm from "../components/molecules/noteForm/NoteForm";
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

	// 보관 메모 필터링
	const activeNotes = notes.filter(note => !note.isKeep);

	// 고정 메모 구분
	const fixedNotes = activeNotes.filter(note => note.isFixed);
	const normalNotes = activeNotes.filter(note => !note.isFixed);

	const handleEditClick = (note: Note) => {
		setEditingNote(note);
	}

	const handleClosePopNote = () => {
		setEditingNote(null)
	}

	return (
		<Layout>
			<NoteForm />
			<p className="title">고정 메모 리스트</p>
			{loading ? (
				<StatusNotice loading={true} menu={'pin'} />
			) : fixedNotes.length === 0 ? (
				<StatusNotice loading={false} menu={'pin'} />
			) : (
				<MasonryList>
					{fixedNotes.map((note) => (
						<NoteCard key={note.id} note={note} onEditClick={handleEditClick} />
					))}
				</MasonryList>
			)}

			<p className="title">메모 리스트</p>
			{error && <p style={{color: 'red'}}>오류 발생: {error}</p>}
			{loading ? (
				<StatusNotice loading={true} menu={'memo'} />
			) : notes.length === 0 ? (
				<StatusNotice loading={false} menu={'memo'} />
			) : (
				<MasonryList>
					{normalNotes.map((note: Note) => (<NoteCard key={note.id} note={note} onEditClick={handleEditClick} />))}
				</MasonryList>
			)};
			{editingNote && (
				<PopNote
					note={editingNote}
					onClose={handleClosePopNote}
				/>
			)}
		</Layout>
	);
}