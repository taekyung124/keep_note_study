import React from "react";
import styles from "./StatusNotice.module.scss";

interface StatusNoticeProps {
	loading?: boolean;
	menu: 'memo' | 'pin' | 'keep' | 'trash' | 'search';
}

const StatusNotice: React.FC<StatusNoticeProps> = ({ loading, menu}) => {
	const noticeConfig = {
		loading: '메모 로딩 중...',
		memo: '메모가 없습니다.',
		pin: '고정된 메모가 여기에 표시됩니다.',
		keep: '보관처리된 메모가 여기에 표시됩니다.',
		trash: '휴지통에 메모가 없습니다.',
		search: '검색 결과가 없습니다.',
	};

	const iconClass = loading ? 'Search' : (menu ? menu.charAt(0).toUpperCase() + menu.slice(1) : '');

	const text = loading ? noticeConfig.loading : noticeConfig[menu];

	return (
		<div className={styles.statusNoticeWrap}>
			<span className={styles[`icon${iconClass}`]}></span>
			<span className={styles.notice}>{text}</span>
		</div>
	)
}

export default StatusNotice;