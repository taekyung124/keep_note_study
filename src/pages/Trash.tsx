import React, { useEffect } from 'react';
import { useNoteStore } from "../store/noteStore";
import Layout from "../components/templates/layout/Layout";
import MasonryList from "../components/molecules/masonryList/MasonryList";
import NoteCard from "../components/molecules/noteCard/NoteCard";
import StatusNotice from "../components/molecules/statusNotice/StatusNotice";
import Btn from "../components/atoms/button/Button";

const Trash: React.FC = () => {
	const { notes, fetchNotes, loading, _hasHydrated } = useNoteStore();
	const deleteNoteAll = useNoteStore((state) => state.deleteNoteAll);

	useEffect(() => {
		if (_hasHydrated) {
			fetchNotes();
		}
	}, [fetchNotes, _hasHydrated]);

	if (!_hasHydrated) return <div>로컬 저장소에서 데이터를 불러오는 중...</div>;

	// 삭제된 메모만 필터링
	const deletedNotes = notes.filter(note => note.isDeleted);

	// 전체 삭제 핸들러
	const handleDeleteAll = async () => {
		if (window.confirm("휴지통을 비우시겠습니까? 휴지통에 있는 모든 메모가 완전히 삭제됩니다.")) {
			try {
				await deleteNoteAll();
				alert('메모가 영구 삭제되었습니다.');
			} catch (error) {
				console.error(error);
				alert('삭제 실패');
			}
		}
	}

	return (
		<Layout>
			<div className="titleWrap">
				<p className="titleItalic">휴지통에 있는 메모는 7일 후에 삭제됩니다.</p>
				{deletedNotes.length > 0 && (
					<Btn type={'button'} size={'md'} text={'휴지통 비우기'} addClass={'fcOrange'} onClick={handleDeleteAll} />
				)}
			</div>
			{loading ? (
				<StatusNotice loading={true} menu={'memo'} />
			) : deletedNotes.length === 0 ? (
				<StatusNotice menu={'trash'} />
			) : (
				<MasonryList>
					{deletedNotes.map((note) => (
						<NoteCard key={note.id} note={note} onEditClick={() => {}} />
					))}
				</MasonryList>
			)}
		</Layout>
	)
};
export default Trash;