import React, { useState } from 'react';
import { useNoteStore } from '../../../store/noteStore';
import { NewNote } from '../../../types/note';
import { Color } from '../../../types/color';

import styles from './NoteForm.module.scss';

import Btn from '../../atoms/button/Button';
import ColorChip from "../../atoms/colorChip/ColorChip";
import Dropdown from "../dropdown/Dropdown";
import FileUpload from "../../atoms/fileUpload/FileUpload";

interface FormNoteState {
	title: string;
	content: string;
	color: Color;
	imageUrls?: string[];
	isFixed?: boolean;
}

const initialFormNote: FormNoteState = {
	title: "",
	content: "",
	color: Color.TRANSPARENT,
	imageUrls: [],
	isFixed: false,
};

const NoteForm: React.FC = () => {
	const addNote = useNoteStore((state) => state.addNote);

	const [formNote, setFormNote] = useState<FormNoteState>(initialFormNote);
	const { title, content, color, imageUrls, isFixed } = formNote;

	const availableColors: Color[] = Object.values(Color);
	const [isColorListVisible, setIsColorListVisible] = useState(false);
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormNote(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			alert("제목과 내용을 모두 입력해 주세요.");
			return;
		}

		const newNote: NewNote = {
			title: title.trim(),
			content: content.trim(),
			color: color,
			imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : undefined,
			isFixed: isFixed,
		};

		try {
			await addNote(newNote);
			setFormNote(initialFormNote);
		} catch (error) {
			console.error("메모 추가 실패:", error);
			alert("메모 추가에 실패했습니다.");
		}
	}

	// 메모 고정 핸들러
	const handleFixToggle = () => {
		setFormNote(prev => ({ ...prev, isFixed: !prev.isFixed }));
	}

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

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onloadend = () => {
			const previewUrl = reader.result as string;

			setFormNote(prevNote => ({
				...prevNote,
				imageUrls: [...(prevNote.imageUrls || []), previewUrl]
			}));
		};
		reader.readAsDataURL(file);
	};

	const handelMenuToggle = () => {
		setIsMenuVisible(prev => !prev);
	}

	return (
		<form className={styles.noteForm} onSubmit={handleSubmit} style={{ backgroundColor: color }}>
			<div className={styles.btnFix}>
				<Btn type={'button'} size={'lg'} icon={isFixed ? 'fix_active' : 'fix'} offscreen={isFixed ? '메모고정' : '고정해제'} onClick={handleFixToggle} />
			</div>
			<div className={styles.textField}>
				<div className={styles.title}>
					<input
						type="text"
						name="title"
						placeholder="제목"
						value={title}
						onChange={handleChange}
					/>
				</div>

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
					name="content"
					placeholder="메모작성.."
					value={content}
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
										selectedColor={color as Color}
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