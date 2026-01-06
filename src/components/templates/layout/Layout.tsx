import React from 'react';
import styles from "./Layout.module.scss"
import Header from "../../organisms/header/Header";
import Navigation from "../../organisms/navigation/Navigation";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.headerWrapper}>
				<Header title={'Keep'} />
			</div>
			<div className={styles.navigationWrapper}>
				<Navigation />
			</div>
			<div className={styles.containerWrapper}>
				<div className={styles.contentWrap}>
					{children}
				</div>
			</div>
		</div>
	)
};

export default Layout;