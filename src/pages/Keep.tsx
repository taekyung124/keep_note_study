import React, {useEffect, useState} from "react";

import {useNoteStore} from "../store/noteStore";
import {Note} from "../types/note";

import Layout from "../components/templates/layout/Layout";
import StatusNotice from "../components/molecules/statusNotice/StatusNotice";
import MasonryList from "../components/molecules/masonryList/MasonryList";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import NoteForm from "../components/molecules/noteForm/NoteForm";
import PopNote from "../components/molecules/popNote/PopNote";


const Keep: React.FC = () => {
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

	const handleEditClick = (note: Note) => {
		setEditingNote(note);
	}

	const handleClosePopNote = () => {
		setEditingNote(null)
	}

	// 보관된 메모 필터링
	const keepedNotes = notes.filter(note => note.isKeep);

	return (
		<Layout>
			<NoteForm />
			<p className="title">보관 처리된 메모 리스트</p>
			{loading ? (
				<StatusNotice loading={true} menu={'keep'} />
			) : keepedNotes.length === 0 ? (
				<StatusNotice loading={false} menu={'keep'} />
			) : (
				<MasonryList>
					{keepedNotes.map((note) => (
						<NoteCard key={note.id} note={note} onEditClick={handleEditClick} />
					))}
				</MasonryList>
			)}
			{editingNote && (
				<PopNote
					note={editingNote}
					onClose={handleClosePopNote}
				/>
			)}
		</Layout>
	)
};
export default Keep;