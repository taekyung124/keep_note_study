import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
	title: string;
}

const Header: React.FC<HeaderProps> = ({
	title,
}) => {
	return (
		<div className={styles.header}>
			<div className={styles.leftArea}>{title}</div>
			<div className={styles.rightArea}></div>
		</div>
	)
}

export default Header;