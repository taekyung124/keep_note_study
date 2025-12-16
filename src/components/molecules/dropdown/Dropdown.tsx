import React from "react";
import styles from "./Dropdown.module.scss";

export interface MenuArray {
	label?: string;
	onClick?: () => void;
}

interface DropdownProps {
	menus: MenuArray[];
}

const Dropdown: React.FC<DropdownProps> = ({
	menus
}) => {
	return (
		<div className={styles.Dropdown}>
			<ul className={styles.menuList}>
				{menus.map((item, idx) => (
					<li
						className={styles.menuItem}
						key={idx}
					>
						<button type={'button'} onClick={item.onClick}>
							<span className={styles.label}>{item.label}</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Dropdown;