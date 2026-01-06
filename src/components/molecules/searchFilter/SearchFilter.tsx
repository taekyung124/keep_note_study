import React, {useState, useMemo} from 'react';
import styles from "./SearchFilter.module.scss";
import {Color} from "../../../types/color";
import { Note } from '../../../types/note';

// components
// import ColorChip from "../../atoms/colorChip/ColorChip";
import Btn from "../../atoms/button/Button";

interface SearchFilterProps {
	notes: Note[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({ notes }) => {
	const usedColors = useMemo(() => {
		const colorSet = new Set(notes.map((note: Note) => note.color));
		const allAvailableColors = Object.values(Color);

		return allAvailableColors.filter(c => colorSet.has(c));
	}, [notes]);

	// 컬러칩 더보기 토글
	const [isOpenContent, setIsOpenContent] = useState(false);

	const handleOverflowToggle = () => {
		setIsOpenContent(!isOpenContent);
	}

	// 메모 유형 데이터 가져오기
	const availableTypes = useMemo(() => {
		return {
			text: notes.some((note: Note) => note.content && note.content.trim().length > 0),
			image: notes.some((note: Note) => note.imageUrls && note.imageUrls.length > 0),
			fixed: notes.some((note: Note) => note.isFixed),
			canvas: false,  // 예: notes.some((note: Note) => note.hasCanvas)
		};
	}, [notes]);

	// 사용 중인 색상이 없으면 렌더링하지 않음
	if (usedColors.length === 0) return null;

	return (
		<div className={styles.searchFilter}>
			<div className={styles.filterBox}>
				<div className={styles.boxHeader}>
					<div className={styles.filterTitle}>유형</div>
				</div>
				<div className={styles.boxContent}>
					<ul className={styles.filterList}>
						{availableTypes.fixed && (
							<li className={styles.filterItem}>
								<button className={styles.btnType}>
									<span className={styles.iconFix}></span>
									<span className={styles.text}>고정</span>
								</button>
							</li>
						)}
						{availableTypes.text && (
							<li className={styles.filterItem}>
								<button className={styles.btnType}>
									<span className={styles.iconText}></span>
									<span className={styles.text}>텍스트</span>
								</button>
							</li>
						)}
						{availableTypes.image && (
							<li className={styles.filterItem}>
								<button className={styles.btnType}>
									<span className={styles.iconImg}></span>
									<span className={styles.text}>이미지</span>
								</button>
							</li>
						)}
						{availableTypes.canvas && (
							<li className={styles.filterItem}>
								<button className={styles.btnType}>
									<span className={styles.iconCanvas}></span>
									<span className={styles.text}>그림</span>
								</button>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className={styles.filterBox}>
				<div className={styles.boxHeader}>
					<div className={styles.filterTitle}>색상</div>
					{usedColors.length > 6 && (
						<Btn
							type={'button'}
							size={'md'}
							text={isOpenContent ? '간략히' : '더보기'}
							addClass={'fcOrange'}
							onClick={handleOverflowToggle}
						/>
					)}
				</div>
				<div
					className={styles.boxContent}
					style={{
						height: isOpenContent ? 179 : 88,
						transition: 'height 0.4s ease-in-out',
					}}
				>
					<ul className={styles.filterList}>
						{usedColors.map((colorValue) => (
							<li key={colorValue} className={styles.filterItem}>
								<button className={styles.btnColorChip}>
									<span
										className={styles.color}
										style={{ background: colorValue }}
									>
										<span className="offscreen">
											{Object.keys(Color).find(key => Color[key as keyof typeof Color] === colorValue) || '컬러'}
										</span>
									</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
export default SearchFilter;