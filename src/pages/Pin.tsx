import React, {useEffect, useState} from "react";

import {useNoteStore} from "../store/noteStore";
import {Note} from "../types/note";

import Layout from "../components/templates/layout/Layout";
import StatusNotice from "../components/molecules/statusNotice/StatusNotice";
import MasonryList from "../components/molecules/masonryList/MasonryList";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import NoteForm from "../components/molecules/noteForm/NoteForm";
import PopNote from "../components/molecules/popNote/PopNote";

const Pin: React.FC = () => {
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

	const handleEditClick = (note: Note) => {
		setEditingNote(note);
	}

	const handleClosePopNote = () => {
		setEditingNote(null)
	}

	return (
		<Layout>
			<NoteForm />
			<div className="titleWrap">
				<p className="title">고정 메모 리스트</p>
			</div>
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
			{editingNote && (
				<PopNote
					note={editingNote}
					onClose={handleClosePopNote}
				/>
			)}
		</Layout>
	)
};
export default Pin;