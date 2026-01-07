import React, { useState } from 'react';
import axios from '../../../api/axiosInstance';
import { useNoteStore } from '../../../store/noteStore';
import { Note, NewNote } from '../../../types/note';
import { Color } from '../../../types/color';

import styles from './NoteForm.module.scss';

import Btn from '../../atoms/button/Button';
import ColorChip from "../../atoms/colorChip/ColorChip";
import Dropdown from "../dropdown/Dropdown";
import FileUpload from "../../atoms/fileUpload/FileUpload";

interface NoteFormProps {
	initialData?: Note;
	onSuccess?: () => void;
}

interface FormNoteState {
	title: string;
	content: string;
	color: Color;
	imageUrls?: string[];
	isFixed?: boolean;
	isKeep?: boolean;
}

const initialFormNote: FormNoteState = {
	title: "",
	content: "",
	color: Color.TRANSPARENT,
	imageUrls: [],
	isFixed: false,
	isKeep: false,
};

const NoteForm: React.FC<NoteFormProps> = ({initialData, onSuccess}) => {
	const addNote = useNoteStore((state) => state.addNote);
	const updateNote = useNoteStore((state) => state.updateNote);

	const convertToFormState = (data: Note): FormNoteState => ({
		title: data.title,
		content: data.content,
		color: data.color as Color,
		imageUrls: data.imageUrls || [],
		isFixed: data.isFixed || false,
		isKeep: data.isKeep || false,
	})

	const [formNote, setFormNote] = useState<FormNoteState>(
		initialData ? convertToFormState(initialData) : initialFormNote
	);
	const { title, content, color, imageUrls, isFixed, isKeep } = formNote;

	React.useEffect(() => {
		if (initialData) {
			setFormNote(convertToFormState(initialData));
		}
	}, [initialData]);

	const availableColors: Color[] = Object.values(Color);
	const [isColorListVisible, setIsColorListVisible] = useState(false);
	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const { title, content, color, imageUrls, isFixed, isKeep } = formNote;

		if (!title.trim() || !content.trim()) {
			alert("제목과 내용을 모두 입력해 주세요.");
			return;
		}

		try {
			if (initialData) {
				// 수정 모드 (기존 데이터가 있을 때)
				await updateNote(initialData.id, {
					title: title.trim(),
					content: content.trim(),
					color,
					imageUrls,
					isFixed,
					isKeep,
				});
				console.log("메모 수정 완료");
			} else {
				// 추가 모드 (신규 작성일 때)
				const newNote: NewNote = {
					title: title.trim(),
					content: content.trim(),
					color,
					imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : undefined,
					isFixed: isFixed,
					isKeep: isKeep,
				};
				await addNote(newNote);
				setFormNote(initialFormNote);
				console.log("메모 추가 완료");
			}

			// 성공 시 팝업 닫기
			if (onSuccess) onSuccess();

		} catch (error) {
			console.error("저장 실패:", error);
			alert("저장에 실패했습니다.");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormNote(prev => ({ ...prev, [name]: value }));
	};

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

	// 메모 보관 핸들러
	const handleKeepToggle = () => {
		setFormNote(prev => ({ ...prev, isKeep: !prev.isKeep }));
	};


	// 이미지 업로드 핸들러
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!initialData) {
			const previewUrl = URL.createObjectURL(file);
			setFormNote(prev => ({
				...prev,
				imageUrls: [...(prev.imageUrls || []), previewUrl]
			}));
			return;
		}

		const formData = new FormData();
		formData.append('imageFile', file);

		try {
			const response = await axios.post(`/notes/${initialData.id}/upload-image`, formData);
			const updatedNote: Note = response.data;

			setFormNote(convertToFormState(updatedNote));
			console.log("서버 업로드 완료");
		} catch (error) {
			console.error("업로드 실패:", error);
			alert("이미지 서버 업로드에 실패했습니다.");
		}
	};

	const handleDeleteImage = (indexToDelete: number) => {
		setFormNote(prevNote => ({
			...prevNote,
			imageUrls: prevNote.imageUrls?.filter((_, index) => index !== indexToDelete) || []
		}));
	};

	const handelMenuToggle = () => {
		setIsMenuVisible(prev => !prev);
	}

	return (
		<form className={styles.noteForm} onSubmit={handleSubmit} style={{ backgroundColor: color }}>
			<div className={styles.btnFix}>
				<Btn type={'button'} size={'lg'} icon={isFixed ? 'fix_active' : 'fix'} offscreen={isFixed ? '고정해제' : '메모고정'} onClick={handleFixToggle} />
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

				{formNote.imageUrls && formNote.imageUrls.length > 0 && (
					<div className={styles.imageContainer}>
						{formNote.imageUrls.map((imageUrl, index) => (
							<div className={styles.imgBox} key={`img-${index}`}>
								<img
									src={imageUrl}
									alt={`${formNote.title} 이미지 ${index + 1}`}
									className={styles.noteImage}
								/>
								<button
									type="button"
									className={styles.btnDelete}
									onClick={() => handleDeleteImage(index)}
								>
									<span className="offscreen">이미지삭제</span>
								</button>
							</div>
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
						<Btn type={'button'} size={'lg'}
							 icon={isKeep ? 'keeped' : 'keep'}
							 offscreen={isKeep? '보관취소' : '메모보관'}
							 onClick={handleKeepToggle}
						/>
					</li>
					<li className={styles.item}>
						<Btn type={'button'} size={'lg'} icon={'more'} offscreen={'더보기'} onClick={handelMenuToggle} />
						{isMenuVisible &&
							<Dropdown menus={[{label: '그림 추가'}, { label: '사본 만들기'}]} />
						}
					</li>
				</ul>
				<Btn
					type={'submit'} size={'md'} text={initialData ? '저장' : '메모 추가'}
					disabled={!title.trim() || !content.trim()}
				/>
			</div>
		</form>
	);
};

export default NoteForm;