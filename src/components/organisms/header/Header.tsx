import React from 'react';
import styles from './Header.module.scss';
import SearchForm from "../../molecules/searchForm/SearchForm";
import Btn from "../../atoms/button/Button";

interface HeaderProps {
	title: string;
}

const Header: React.FC<HeaderProps> = ({
	title,
}) => {
	return (
		<div className={styles.header}>
			<div className={styles.leftArea}>
				<Btn type={'button'} size={'lg'} icon={'menu'} />
				<a className={styles.logo} href={'javascript:void(0);'}>
					<img src="/assets/images/logo_keep.png" alt="Keep Notes" />
					<span className={styles.title}>Keep</span>
				</a>
			</div>
			<div className={styles.searchArea}>
				<SearchForm />
			</div>
			<div className={styles.rightArea}>
				<Btn type={'button'} size={'lg'} icon={'refresh'} />
				<Btn type={'button'} size={'lg'} icon={'list_col'} />
				<Btn type={'button'} size={'lg'} icon={'list_row'} />
			</div>
		</div>
	)
}

export default Header;