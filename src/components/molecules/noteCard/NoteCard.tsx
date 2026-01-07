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
	onEditClick: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEditClick }) => {
	const availableColors: Color[] = Object.values(Color);

	const deleteNote = useNoteStore((state) => state.deleteNote);
	const updateNote = useNoteStore((state) => state.updateNote);

	const handleFixToggle = () => {
		updateNote(note.id, { isFixed: !note.isFixed });
	};

	// 삭제 버튼 핸들러
	const handleDelete = async () => {
		if (note.isDeleted) {
			// 영구삭제
			if (window.confirm("이 메모를 영구적으로 삭제하시겠습니까?")) {
				try {
					await deleteNote(note.id);
					alert('메모가 영구 삭제되었습니다.');
				} catch (error) {
					alert('삭제 실패');
				}
			}
		} else {
			// 일반 삭제
			if (window.confirm(`"${note.title}" 메모를 삭제 하시겠습니까?`)) {
				try {
					await updateNote(note.id, { isDeleted: true });
					alert('메모가 휴지통으로 이동되었습니다.');
				} catch (error) {
					console.error("휴지통 이동 실패:", error);
					alert('휴지통 이동에 실패했습니다.');
				}
			}
		}
	};

	// 삭제 복구 핸들러 추가
	const handleRestore = async () => {
		try {
			await updateNote(note.id, { isDeleted: false });
			alert('메모가 복구되었습니다.');
		} catch (error) {
			alert('복구 실패');
		}
	};

	// 컬러 변경 버튼 이벤트
	const [isColorListVisible, setIsColorListVisible] = useState(false);

	const handleColorChipToggle = () => {
		setIsColorListVisible(prev => !prev);
	};

	// 컬러 변경 핸들러
	const handleColorChange = async (newColor: Color) => {
		if (newColor === note.color) return;

		try {
			await axios.patch(`/notes/${note.id}`, { color: newColor });
			updateNote(note.id, { color: newColor });

			console.log(`메모 ${note.id}의 색상이 ${newColor}로 변경되었습니다.`);

		} catch (error) {
			console.error("메모 색상 업데이트 실패:", error);
		}
		setIsColorListVisible(false);
	};

	// 이미지 업로드 핸들러
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('imageFile', file);

		try {
			// 1. 로컬 미리보기를 하지 않고 바로 서버로 전송
			const response = await axios.post(`/notes/${note.id}/upload-image`, formData);

			// 2. 서버가 준 짧은 주소로 스토어 업데이트 (딱 한 번만 실행)
			const updatedNote: Note = response.data;
			updateNote(note.id, updatedNote);

		} catch (error) {
			alert('업로드 실패');
		}
	};

	// 더보기 선택 시 노출
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const handelMenuToggle = () => {
		setIsMenuVisible(prev => !prev);
	}

	// 메모 보관 핸들러
	const handleKeepToggle = async () => {
		try {
			const newKeepStatus = !note.isKeep;
			await axios.patch(`/notes/${note.id}`, { isKeep: newKeepStatus });
			updateNote(note.id, { isKeep: newKeepStatus });
		} catch (error) {
			console.error("보관 처리 실패:", error);
		}
	};

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
			{note.isDeleted ? (
				<div className={styles.hoverBox}>
					<ul className={styles.editList}>
						<li className={styles.item}>
							<Btn type={'button'} size={'lg'} icon={'delete'} offscreen={'영구삭제'} onClick={handleDelete} />
						</li>
						<li className={styles.item}>
							<Btn type={'button'} size={'lg'} icon={'restore'} offscreen={'복원'} onClick={handleRestore} />
						</li>
					</ul>
				</div>
			) : (
				<div className={styles.hoverBox}>
					<ul className={styles.editList}>
						<li className={styles.item}>
							<Btn type={'button'} size={'lg'} icon={note.isFixed ? 'fix_active' : 'fix'} offscreen={note.isFixed ? '고정해제' : '메모고정'} onClick={handleFixToggle} />
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
							<Btn type={'button'} size={'lg'}
								 icon={note.isKeep ? 'keeped' : 'keep'}
								 offscreen={note.isKeep ? '보관취소' : '메모보관'}
								 onClick={handleKeepToggle}
							/>
						</li>
						<li className={styles.item}>
							<Btn type={'button'} size={'lg'} icon={'more'} offscreen={'더보기'} onClick={handelMenuToggle} />
							{isMenuVisible &&
								<Dropdown menus={[{label: '그림 추가'}, {label: '사본 만들기'}]} />
							}
						</li>
						<li className={styles.item}>
							<Btn type={'button'} size={'lg'} icon={'close'} offscreen={'메모삭제'} onClick={handleDelete} />
						</li>
					</ul>
				</div>
			)}
			<button className={styles.btnLink} onClick={() => onEditClick(note)}>
				<span className="offscreen">메모편집</span>
			</button>
		</div>
	);
};

export default NoteCard;