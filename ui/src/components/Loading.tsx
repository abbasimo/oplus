import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTimeout } from '@remate/core';
import clsx from 'clsx';

export type LoadingProps = {
	delay?: number;
	className?: string;
};

/**
 * Loading displays a loading state with an optional delay
 */
function Loading(props: LoadingProps) {
	const { delay = 0, className } = props;
	const [showLoading, setShowLoading] = useState(!delay);
	const { t } = useTranslation();

	useTimeout(() => {
		setShowLoading(true);
	}, delay);

	return (
		<div
			className={clsx(
				className,
				'flex flex-1 h-full w-full self-center flex-col items-center justify-center p-24',
				!showLoading ? 'hidden' : ''
			)}
		>
			<Typography
				className="-mb-16 text-13 font-medium sm:text-20"
				color="text.secondary"
			>
				{t('LOADING')}
			</Typography>
			<Box
				id="spinner"
				sx={{
					'& > div': {
						backgroundColor: 'palette.secondary.main'
					}
				}}
			>
				<div className="bounce1" />
				<div className="bounce2" />
				<div className="bounce3" />
			</Box>
		</div>
	);
}

export default Loading;
