import React from 'react';
import styles from './Button.module.scss';

type CommonProps = {
	size?: 'xxl' | 'xl' | 'lg' | 'md' | 'sm';
	text?: string;
	icon?: string;
	offscreen?: string;
	disabled?: boolean;
	addClass?: string;
	onClick?: () => void;
}

type ButtonAsButton = {
	tag?: 'button';
	type?: 'button' | 'submit' | 'reset';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsAnchor = {
	tag: 'a';
	href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = CommonProps  & (ButtonAsButton | ButtonAsAnchor);

const Btn: React.FC<ButtonProps> = ({
	size, text, icon, offscreen, disabled, addClass, onClick, tag = 'button', ...restProps
}) => {
	const renderIcon = (typeof icon === 'string') ? (<span className={styles.icon} style={{backgroundImage: `url("/assets/icons/icon_${icon}.svg")`}}></span>) : icon;
	const baseClass = [
		styles.button,
		size && styles[`${size}`],
	];

	const classNames = [
		...baseClass,
		disabled ? styles.disabled : ''
	];

	if (tag === 'a') {
		const{href, ...anchorProps} = restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>;
		return (
			<a
				className={`${baseClass.join(' ')}`}
				aria-disabled={disabled}
				href={disabled ? undefined : href}
				{...anchorProps}
			>
				{text && <span className={[styles.text, addClass].join(' ')}>{text}</span>}
				{icon && renderIcon}
				{offscreen && <span className="offscreen">{offscreen}</span>}
			</a>
		)
	}

	const {type = 'button', ...buttonProps} = restProps as React.ButtonHTMLAttributes<HTMLButtonElement>;

	return (
		<button
			className={`${classNames.join(' ')}`}
			type={type}
			disabled={disabled}
			onClick={onClick}
			{...buttonProps}
		>
			{text && <span className={[styles.text, addClass].join(' ')}>{text}</span>}
			{icon && renderIcon}
			{offscreen && <span className="offscreen">{offscreen}</span>}
		</button>
	)
}
export default Btn;