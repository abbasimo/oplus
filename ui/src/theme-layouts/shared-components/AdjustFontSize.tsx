import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiTextAa } from 'react-icons/pi';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { SecureLocalStorage } from '@remate/core';

const marks = [
	{ value: 0.7, label: '70%' },
	{ value: 0.8, label: '80%' },
	{ value: 0.9, label: '90%' },
	{ value: 1, label: '100%' },
	{ value: 1.1, label: '110%' },
	{ value: 1.2, label: '120%' },
	{ value: 1.3, label: '130%' }
];

type AdjustFontSizeProps = {
	className?: string;
};

/**
 * The adjust font size.
 */
function AdjustFontSize(props: AdjustFontSizeProps) {
	const { t } = useTranslation();
	const { className = '' } = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [fontSize, setFontSize] = useState(() => SecureLocalStorage.getItem<number | null>('font_size') ?? 1);
	const [currentFontSize, setcurrentFontSize] = useState(fontSize);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		SecureLocalStorage.setItem('font_size', currentFontSize);
		const html = document.getElementsByTagName('html')[0];
		html.style.fontSize = `${currentFontSize * 62.5}%`;
	}, [currentFontSize]);

	return (
		<div>
			<IconButton
				className={className}
				aria-controls="font-size-menu"
				aria-haspopup="true"
				onClick={handleClick}
				color="inherit"
			>
				<PiTextAa />
			</IconButton>
			<Menu
				classes={{ paper: 'w-320' }}
				id="font-size-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				<div className="px-24 py-12">
					<Typography className="mb-8 flex items-center justify-center text-16 font-semibold">
						<PiTextAa fontSize={24} />
						&nbsp;
						{t('FONT_SIZE')}
					</Typography>
					<Slider
						value={fontSize}
						aria-labelledby="discrete-slider-small-steps"
						step={0.1}
						marks={marks}
						min={0.7}
						max={1.3}
						valueLabelDisplay="off"
						onChange={(ev, value) => {
							setFontSize(value as number);
						}}
						onChangeCommitted={(ev, value) => {
							setcurrentFontSize(value as number);
						}}
					/>
				</div>
			</Menu>
		</div>
	);
}

export default AdjustFontSize;
