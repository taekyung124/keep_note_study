import React, {useEffect, useState} from "react";
import { useNoteStore } from "../store/noteStore";
import {Note} from "../types/note";

import Layout from "../components/templates/layout/Layout";
import SearchFilter from "../components/molecules/searchFilter/SearchFilter";
import MasonryList from "../components/molecules/masonryList/MasonryList";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import PopNote from "../components/molecules/popNote/PopNote";

const Search: React.FC = () => {
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
		<Layout>
			<SearchFilter notes={notes} />
			<p className="title">고정 메모 리스트</p>
			{loading ? (
				<p>고정된 메모를 불러오는 중입니다...</p>
			) : fixedNotes.length === 0 ? (
				<p>고정된 메모가 없습니다. 새로 작성해 보세요.</p>
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
				<p>메모를 불러오는 중입니다...</p>
			) : notes.length === 0 ? (
				<p>메모가 없습니다. 새로 작성해 보세요.</p>
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
	)
};
export default Search;