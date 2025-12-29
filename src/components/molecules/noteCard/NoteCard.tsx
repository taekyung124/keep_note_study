import React, { useState } from 'react';
import axios from '../../../api/axiosInstance';
import { Note } from '../../../types/note';
import { Color } from '../../../types/color';
import { useNoteStore } from '../../../store/noteStore';

import styles from "./NoteCard.module.scss";

import ColorChip from "../../atoms/colorChip/ColorChip";
import Btn from "../../atoms/button/Button";
import FileUpload from "../../atoms/fileUpload/FileUpload";
import Dropdown from "../dropdown/Dropdown";

interface NoteCardProps {
	note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note: initialNote }) => {
	const [note, setNote] = useState<Note>(() => ({
		...initialNote,
		color: initialNote.color && Object.values(Color).includes(initialNote.color as Color)
			? initialNote.color
			: Color.TRANSPARENT,
		imageUrls: initialNote.imageUrls || [],
	}));
	const availableColors: Color[] = Object.values(Color);

	const deleteNote = useNoteStore((state) => state.deleteNote);
	const updateNote = useNoteStore((state) => state.updateNote);

	const [isFixed, setIsFixed] = useState(false);

	// 메모 고정 핸들러
	const handleFixToggle = () => {
		setIsFixed(!isFixed);
	}

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

		// 로컬 이미지 미리보기
		const reader = new FileReader();

		reader.onloadend = () => {
			const previewUrl = reader.result as string;

			setNote(prevNote => ({
				...prevNote,
				imageUrls: [...(prevNote.imageUrls || []), previewUrl]
			}));
			console.log("로컬 이미지 미리보기 URL 생성 및 추가 완료.");
		};
		reader.readAsDataURL(file);

		const formData = new FormData();
		formData.append('imageFile', file);

		try {
			const response = await axios.post(`/notes/${note.id}/upload-image`, formData);

			const updatedNote: Note = response.data; // 서버에서 받은 최종 Note 객체

			setNote(updatedNote);
			updateNote(note.id, updatedNote);

			console.log("이미지 업로드 성공 및 최종 URL 저장:", updatedNote.imageUrls);
			alert('이미지가 성공적으로 업로드되었습니다.');

		} catch (error) {
			console.error("이미지 업로드 실패:", error);
			alert('이미지 업로드에 실패했습니다. 마지막 미리보기 이미지를 제거합니다.');

			// 업로드 실패 시 마지막으로 추가된 미리보기 이미지 제거
			setNote(prevNote => ({
				...prevNote,
				imageUrls: (prevNote.imageUrls || []).slice(0, -1)
			}));
		}
	};

	// 더보기 선택 시 노출
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const handelMenuToggle = () => {
		setIsMenuVisible(prev => !prev);
	}

	return (
		<div className={styles.cardWrap}
			 style={{
				 border: `1px solid ${note.color === `${Color.TRANSPARENT}` ? '#AAA' : note.color}`,
				 backgroundColor: note.color,
			 }}>
			{note.imageUrls && note.imageUrls.length > 0 && (
				<div className={styles.imageContainer}>
					{note.imageUrls.map((imageUrl, index) => (
						<img
							key={imageUrl.length > 50 ? index : imageUrl}
							src={imageUrl}
							alt={`${note.title} 이미지 ${index + 1}`}
							className={styles.noteImage}
						/>
					))}
				</div>
			)}
			<h3 className={styles.title}>{note.title}</h3>
			<p className={styles.text}>{note.content}</p>

			<div className={styles.hoverBox}>
				<ul className={styles.editList}>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={isFixed ? 'fix_active' : 'fix'} offscreen={isFixed ? '메모고정' : '고정해제'} onClick={handleFixToggle} />
					</li>
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
						<Btn type={'button'} size={'lg'} icon={'more'} offscreen={'더보기'} onClick={handelMenuToggle} />
						{isMenuVisible &&
							<Dropdown menus={[{label: '그림 추가'}, {label: '사본 만들기'}]} />
						}
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