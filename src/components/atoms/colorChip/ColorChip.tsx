import React from 'react';
import {Color} from '../../../types/color';
import styles from './ColorChip.module.scss';

interface ColorChipProps {
	colorCode: Color;
	selectedColor: Color;
	onSelect: (colorCode: Color) => void;
}

const ColorChip: React.FC<ColorChipProps> = ({
	colorCode, selectedColor, onSelect
}) => {
	const isSelected = colorCode === selectedColor;
	const handleClick = () => {
		onSelect(colorCode);
	};

	const chipStyle: React.CSSProperties = {
		backgroundColor: colorCode === Color.TRANSPARENT ? '#FFF' : colorCode,
	};

	return (
		<div
			className={[styles.colorChip, isSelected ? styles.isSelected : ''].join(' ')}
			style={chipStyle}
			onClick={handleClick}
			role="button"
			aria-label={`${colorCode} 색상 선택`}
		>
			{isSelected && <div className={styles.checkMark}>✓</div>}
		</div>
	)
}
export default ColorChip;