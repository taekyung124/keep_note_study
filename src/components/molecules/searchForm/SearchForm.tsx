import React, { useState, useCallback } from 'react';
import styles from "./SearchForm.module.scss";

import Btn from "../../atoms/button/Button";

interface SearchFormState {

}

const SearchForm: React.FC<SearchFormState> = ({

}) => {
	const [searchText, setSearchText] = useState('');

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	}, []);

	const handleClearSearch = useCallback(() => {
		setSearchText(''); // 빈 문자열로 초기화
	}, []);

	return (
		<form
			className={styles.searchForm}
			method={'get'}
			role={'search'}
		>
			<Btn type={'button'} size={'lg'} icon={'search'} offscreen={'검색'} />
			<div className={styles.searchInput}>
				<input
					type={'text'}
					className={styles.input}
					aria-label={'검색'}
					autoComplete={'off'}
					placeholder={'검색'}
					value={searchText}
					onChange={handleInputChange}
				/>
			</div>
			<Btn
				type={'button'} size={'lg'} icon={'close'}
				onClick={handleClearSearch} offscreen={'검색어 지우기'}
				disabled={!searchText}
			/>
		</form>
	);
}
export default SearchForm;