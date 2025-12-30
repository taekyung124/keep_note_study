import React from 'react';
import styles from './Navigation.module.scss';

interface NavigationProps {
}

const Navigation: React.FC<NavigationProps> = ({
}) => {
	return (
		<div className={styles.navigation}>
			<ul className={styles.menuList}>
				<li className={styles.menuItem}>
					<a href="javascript:void(0);" className={styles.linkMenu}>
						<span className={styles.iconMemo}></span>
						<span className={styles.menu}>메모</span>
					</a>
				</li>
				<li className={styles.menuItem}>
					<a href="javascript:void(0);" className={styles.linkMenu}>
						<span className={styles.iconPin}></span>
						<span className={styles.menu}>고정</span>
					</a>
				</li>
				<li className={styles.menuItem}>
					<a href="javascript:void(0);" className={styles.linkMenu}>
						<span className={styles.iconKeep}></span>
						<span className={styles.menu}>보관처리</span>
					</a>
				</li>
				<li className={styles.menuItem}>
					<a href="javascript:void(0);" className={styles.linkMenu}>
						<span className={styles.iconTrashcan}></span>
						<span className={styles.menu}>휴지통</span>
					</a>
				</li>
			</ul>
		</div>
	)
}

export default Navigation;