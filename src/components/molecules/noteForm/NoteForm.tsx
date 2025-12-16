import React, { useState } from 'react';
import { useNoteStore } from '../../../store/noteStore';
import { NewNote } from '../../../types/note';
import { Color } from '../../../types/color';

import styles from './NoteForm.module.scss';

import Btn from '../../atoms/button/Button';
import ColorChip from "../../atoms/colorChip/ColorChip";
import Dropdown from "../dropdown/Dropdown";
import FileUpload from "../../atoms/fileUpload/FileUpload";

// 💡 NewNote 타입을 확장한 로컬 타입 정의 (NoteCard의 note 상태와 유사하게 구성)
interface FormNoteState {
	title: string;
	content: string;
	color: Color;
	imageUrls?: string[];
}

// 🟢 초기 상태 정의 (formNote 초기화에 사용)
const initialFormNote: FormNoteState = {
	title: "",
	content: "",
	color: Color.TRANSPARENT,
	imageUrls: [],
};

const NoteForm: React.FC = () => {
	const addNote = useNoteStore((state) => state.addNote);

	// 🟢 1. 폼 상태를 formNote 하나로 통합하여 관리 (NoteCard의 [note, setNote]와 유사)
	const [formNote, setFormNote] = useState<FormNoteState>(initialFormNote);
	const { title, content, color, imageUrls } = formNote;

	// 컬러 및 메뉴 상태
	const availableColors: Color[] = Object.values(Color);
	const [isColorListVisible, setIsColorListVisible] = useState(false);
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	// 💡 단일 핸들러 함수로 타이틀/내용 상태 업데이트
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormNote(prev => ({ ...prev, [name]: value }));
	};

	// 🟢 2. 메모 추가 핸들러 함수
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			alert("제목과 내용을 모두 입력해 주세요.");
			return;
		}

		const newNote: NewNote = { // NewNote 타입에 맞게 객체 구성
			title: title.trim(),
			content: content.trim(),
			color: color,
			imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : undefined, // 이미지 URL이 있을 경우 포함
		};

		try {
			await addNote(newNote);
			// 성공 후 폼 상태 전체 초기화
			setFormNote(initialFormNote);
		} catch (error) {
			console.error("메모 추가 실패:", error);
			alert("메모 추가에 실패했습니다.");
		}
	}

	// 🟢 3. 컬러 변경 핸들러 (서버 통신 제거, setFormNote만 사용)
	const handleColorChipToggle = () => {
		setIsColorListVisible(prev => !prev);
	};

	const handleColorChange = (newColor: Color) => {
		setFormNote(prev => ({
			...prev,
			color: newColor
		}));
		setIsColorListVisible(false);
	};

	// 🟢 4. 이미지 업로드 핸들러 (서버 통신 제거, setFormNote만 사용)
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onloadend = () => {
			const previewUrl = reader.result as string;

			// setFormNote로 상태 업데이트하여 이미지 미리보기 구현
			setFormNote(prevNote => ({
				...prevNote,
				imageUrls: [...(prevNote.imageUrls || []), previewUrl]
			}));
		};
		reader.readAsDataURL(file);
	};

	// 🟢 5. 더보기 메뉴 토글
	const handelMenuToggle = () => {
		setIsMenuVisible(prev => !prev);
	}

	return (
		<form className={styles.noteForm} onSubmit={handleSubmit} style={{ backgroundColor: color }}>
			<div className={styles.btnFix}>
				<Btn type={'button'} size={'lg'} icon={'fix'} offscreen={'메모고정'} />
			</div>
			<div className={styles.textField}>
				<div className={styles.title}>
					<input
						type="text"
						name="title" // 🟢 handleChange를 위해 name 추가
						placeholder="제목"
						value={title} // 🟢 formNote.title 사용
						onChange={handleChange}
					/>
				</div>

				{/* 🟢 formNote.imageUrls 사용 */}
				{imageUrls && imageUrls.length > 0 && (
					<div className={styles.imageContainer}>
						{imageUrls.map((imageUrl, index) => (
							<img
								key={imageUrl.length > 50 ? index : imageUrl}
								src={imageUrl}
								alt={`${title} 이미지 ${index + 1}`}
								className={styles.noteImage}
							/>
						))}
					</div>
				)}

				<div className={styles.content}>
                <textarea
					name="content" // 🟢 handleChange를 위해 name 추가
					placeholder="메모작성.."
					value={content} // 🟢 formNote.content 사용
					onChange={handleChange}
				/>
				</div>
			</div>

			<div className={styles.noteToolbar}>
				<ul className={styles.toolbarList}>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'palette'} offscreen={'컬러선택'} onClick={handleColorChipToggle} />
						{isColorListVisible &&
							<div className={styles.colorList}>
								{availableColors.map((colorCode: Color) => (
									<ColorChip
										key={colorCode}
										colorCode={colorCode}
										selectedColor={color as Color} // 🟢 formNote.color 사용
										onSelect={handleColorChange}
									/>
								))}
							</div>
						}
					</li>

					{/* 🟢 FileUpload 컴포넌트 복구 */}
					<li className={styles.item}>
						<FileUpload onFileChange={handleImageUpload} />
					</li>

					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'keep'} offscreen={'메모 보관'} />
					</li>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'more'} offscreen={'더보기'} onClick={handelMenuToggle} />
						{isMenuVisible &&
							<Dropdown menus={[{label: '그림 추가'}, { label: '사본 만들기'}]} />
						}
					</li>
				</ul>
				<Btn
					type={'submit'} size={'md'} text={'메모 추가'}
					disabled={!title.trim() || !content.trim()}
				/>
			</div>
		</form>
	);
};

export default NoteForm;