import React from 'react';
import styles from './Tag.module.scss';

interface TagProps {
	isAlarm: boolean;
	label?: string;
	day?: string;
	time?: string;
}

const Tag: React.FC<TagProps> = ({
	isAlarm, label, day, time,
}) => {
	return (
		<span className={styles.tag}>
			{isAlarm ? (
				<>
					<span className={styles.icon}></span>
					<span className={styles.text}>{day}, {time}</span>
				</>
			) : (
				<span className={styles.text}>{label}</span>
			)}
		</span>
	)
}

export default Tag;