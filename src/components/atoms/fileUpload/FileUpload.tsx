import React from 'react';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
	onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
	onFileChange
}) => {
	return (
		<div className={styles.fileUpload} aria-label={'이미지 추가'} data-tooltip-text={'이미지 추가'}>
			<form action="/upload-endpoint" method="post" encType="multipart/form-data">
				<label htmlFor={'imageUpload'}>
					<input
						type={'file'}
						id={'imageUpload'}
						name={'imageFile'}
						accept={'image/*'}
						onChange={onFileChange}
						multiple={true}
					/>
				</label>
			</form>
		</div>
	)
}
export default FileUpload;