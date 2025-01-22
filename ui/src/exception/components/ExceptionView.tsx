import React from 'react';
import { useTranslation } from 'react-i18next';
import { PiArrowCounterClockwise } from 'react-icons/pi';
import Button, { ButtonProps } from '@mui/material/Button';
import Container, { ContainerProps } from '@mui/material/Container';
import Grid, { GridProps } from '@mui/material/Grid';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { motion } from 'framer-motion';
import i18n from 'src/i18n';

import Exception from '../Exception';
import en from '../i18n/en';
import fa from '../i18n/fa';

i18n.addResources('en', 'exceptions', en);
i18n.addResources('fa', 'exceptions', fa);

export interface IExceptionViewProps {
	retry: () => void;
	exception: Exception;
	options?: {
		useI18n?: boolean;
		i18nResourceName?: string;
		showDescription?: boolean;
		showImage?: boolean;
		showHomePageButton?: boolean;
		showResetButton?: boolean;
		homePageButtonProps?: ButtonProps;
		resetButtonProps?: ButtonProps;
		homePageButtonText?: string;
		resetButtonText?: string;
		titleProps?: TypographyProps;
		descProps?: TypographyProps;
		containerProps?: ContainerProps;
		gridContainerProps?: GridProps;
		imageElement?: React.ReactNode;
	};
}

function ExceptionView({ retry, exception, options = {} }: IExceptionViewProps) {
	const {
		resetButtonText = 'Try again',
		resetButtonProps,
		showDescription = true,
		showImage = true,
		useI18n = true,
		i18nResourceName,
		titleProps,
		descProps,
		containerProps,
		gridContainerProps,
		imageElement,
		showResetButton
	} = options;

	const { t } = useTranslation(i18nResourceName);

	return (
		<div className="flex w-full h-full justify-center items-center">
			<Container
				disableGutters
				maxWidth="md"
				className="relative"
				{...containerProps}
			>
				<div className="flex flex-col px-16 h-full w-full justify-center">
					{showImage && imageElement && (
						<motion.div
							initial={{ opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
						>
							<div className="flex justify-center mb-20">
								<React.Suspense>{imageElement}</React.Suspense>
							</div>
						</motion.div>
					)}

					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
					>
						<Typography
							variant="title2"
							className="!mt-20 text-center"
							color="text.primary"
							{...titleProps}
						>
							{useI18n ? t(exception.message) : exception.message}
						</Typography>
					</motion.div>

					{showDescription && exception.desc && (
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						>
							<Typography
								variant="body1"
								className="!mt-12 text-center"
								color="text.secondary"
								{...descProps}
							>
								{useI18n ? t(exception.desc) : exception.desc}
							</Typography>
						</motion.div>
					)}

					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={2.5}
						className="pt-40"
						{...gridContainerProps}
					>
						{showResetButton && (
							<Grid
								item
								xs={12}
								sm="auto"
							>
								<Button
									color="primary"
									variant="contained"
									fullWidth
									className="px-40"
									endIcon={<PiArrowCounterClockwise />}
									{...resetButtonProps}
									onClick={retry}
								>
									{resetButtonText}
								</Button>
							</Grid>
						)}

						{/* {showHomePageButton && (
							<Grid
								item
								xs={12}
								sm="auto"
							>
								<Button
									fullWidth
									color="primary"
									variant="outlined"
									className="px-24"
									endIcon={<PiHouse />}
									{...homePageButtonProps}
									onClick={() => {
										flush().then(() => {
											retry();
											navigate('/');
										});
									}}
								>
									{homePageButtonText}
								</Button>
							</Grid>
						)} */}
					</Grid>
				</div>
			</Container>
		</div>
	);
}

export default ExceptionView;
