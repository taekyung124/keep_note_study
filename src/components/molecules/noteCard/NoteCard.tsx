import React, { useState } from 'react';
import axios from '../../../api/axiosInstance';
import { Note } from '../../../types/note';
import { Color } from '../../../types/color';
import { useNoteStore } from '../../../store/noteStore';

import styles from "./NoteCard.module.scss";

import ColorChip from "../../atoms/colorChip/ColorChip";
import Btn from "../../atoms/button/Button";
import FileUpload from "../../atoms/fileUpload/FileUpload";

interface NoteCardProps {
	note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note: initialNote }) => {
	const [note, setNote] = useState<Note>(() => ({
		...initialNote,
		color: initialNote.color && Object.values(Color).includes(initialNote.color as Color)
			? initialNote.color
			: Color.TRANSPARENT,
		imageUrl: initialNote.imageUrl || null
	}));
	const availableColors: Color[] = Object.values(Color);

	const deleteNote = useNoteStore((state) => state.deleteNote);
	const updateNote = useNoteStore((state) => state.updateNote);

	// 삭제 버튼 핸들러
	const handleDelete = async () => {
		if (window.confirm(`"${note.title}" 메모를 정말 삭제하시겠습니까?`)) {
			try {
				await deleteNote(note.id);
				alert('메모가 삭제되었습니다.');
			} catch (error) {
				console.error("메모 삭제 실패:", error);
				alert('메모 삭제에 실패했습니다.');
			}
		}
	};

	// 컬러 변경 버튼 이벤트
	const [isColorListVisible, setIsColorListVisible] = useState(false);

	const handleColorChipToggle = () => {
		setIsColorListVisible(prev => !prev);
	};

	// 컬러 변경 핸들러
	const handleColorChange = async (newColor: Color) => {
		if (newColor === note.color) {
			return;
		}

		try {
			const response = await axios.patch(`/notes/${note.id}`, {
				color: newColor
			});

			const updatedNote: Note = response.data;

			setNote(updatedNote);
			updateNote(note.id, { color: newColor });

			console.log(`메모 ${note.id}의 색상이 ${newColor}로 변경되었습니다.`);

		} catch (error) {
			console.error("메모 색상 업데이트 실패:", error);
		}

		setIsColorListVisible(false);
	};

	// 이미지 업로드 핸들러
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log("--- handleImageUpload 호출됨 ---");

		const file = event.target.files?.[0];
		if (!file) {
			console.log("파일이 선택되지 않았거나 취소됨");
			return;
		}

		console.log("파일 선택됨:", file.name);

		const formData = new FormData();
		formData.append('imageFile', file);

		try {
			const response = await axios.post(`/notes/${note.id}/upload-image`, formData);
			const updatedNote: Note = response.data;
			const uploadedImageUrl = updatedNote.imageUrl || null;

			setNote(updatedNote);

			console.log("이미지 업로드 성공, URL:", uploadedImageUrl);
			alert('이미지가 성공적으로 업로드되었습니다.');

		} catch (error) {
			console.error("이미지 업로드 실패:", error);
			alert('이미지 업로드에 실패했습니다.');
		}
	};

	return (
		<div className={styles.cardWrap}
			 style={{
				 border: `1px solid ${note.color === `${Color.TRANSPARENT}` ? '#AAA' : note.color}`,
				 backgroundColor: note.color,
			 }}>
			{note.imageUrl && (
				<div className={styles.imageContainer}>
					<img src={note.imageUrl} alt={`${note.title} 이미지`} className={styles.noteImage} />
				</div>
			)}
			<h3 className={styles.title}>{note.title}</h3>
			<p className={styles.text}>{note.content}</p>

			<div className={styles.hoverBox}>
				<ul className={styles.editList}>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'palette'} offscreen={'컬러선택'} onClick={handleColorChipToggle} />
						{isColorListVisible &&
							<div className={styles.colorList}>
								{availableColors.map((colorCode: Color) => (
									<ColorChip
										key={colorCode}
										colorCode={colorCode}
										selectedColor={note.color as Color}
										onSelect={handleColorChange}
									/>
								))}
							</div>
						}
					</li>
					<li className={styles.item}>
						<FileUpload onFileChange={handleImageUpload} />
					</li>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'keep'} offscreen={'메모 보관'} />
					</li>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'more'} offscreen={'더보기'} />
					</li>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'close'} offscreen={'메모 삭제'} onClick={handleDelete} />
					</li>
				</ul>
			</div>
		</div>
	);
};

export default NoteCard;