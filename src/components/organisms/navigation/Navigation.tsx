import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './Navigation.module.scss';

const Navigation: React.FC = () => {
	const location = useLocation();

	const menus = [
		{ path: '/Memo', label: '메모', icon: styles.iconMemo },
		{ path: '/Pin', label: '고정', icon: styles.iconPin },
		{ path: '/Keep', label: '보관처리', icon: styles.iconKeep },
		{ path: '/Trash', label: '휴지통', icon: styles.iconTrashcan },
	];

	return (
		<div className={styles.navigation}>
			<ul className={styles.menuList}>
				{menus.map((menu) => {
					const isActive = location.pathname === menu.path;

					return (
						<li key={menu.path} className={styles.menuItem}>
							<Link
								to={menu.path}
								className={`${styles.linkMenu} ${isActive ? styles.active : ''}`}
							>
								<span className={menu.icon}></span>
								<span className={styles.menu}>{menu.label}</span>
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default Navigation;