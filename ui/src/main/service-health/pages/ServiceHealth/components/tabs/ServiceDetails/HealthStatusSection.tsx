import { useMemo } from 'react';
import { MdDeveloperMode } from 'react-icons/md';
import { ServiceOutages } from '@main/service-health/api/types';
import {
	Box,
	Divider,
	Grid2,
	Paper,
	Stack,
	styled,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography
} from '@mui/material';
import { eachDayOfInterval, format, formatDuration, isBefore, isEqual, subDays } from 'date-fns-jalali';
import { motion } from 'framer-motion';

export interface IHealthStatusSectionProps {
	outages: ServiceOutages;
	serviceCreateDate: string;
}

const today = new Date();
const ninetyDaysAgo = subDays(today, 89);

const dateRange = eachDayOfInterval({ start: ninetyDaysAgo, end: today });

export default function HealthStatusSection({ outages, serviceCreateDate }: IHealthStatusSectionProps) {
	const stabillityOfService = useMemo(() => {
		const sumOutages = outages.reduce((sum: number, outageItem) => {
			const sumDateOutages = outageItem.outages.reduce((sumDateOutages: number, outage) => {
				return sumDateOutages + outage.downtime_duration;
			}, 0);

			return sum + sumDateOutages;
		}, 0);

		return (100 - (sumOutages / (outages?.length * 24 * 60 * 60)) * 100).toFixed(2);
	}, [outages]);

	return (
		<Grid2
			container
			spacing={2}
		>
			<Grid2 size={12}>
				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
				>
					<MdDeveloperMode fontSize={24} />
					<Typography variant="title3">وضعیت سلامت سرویس</Typography>
				</Stack>
			</Grid2>
			<Grid2 size={12}>
				<Paper
					className="px-32 py-24"
					variant="outlined"
				>
					<Grid2
						container
						spacing={2}
					>
						<Grid2 size={12}>
							<Grid2
								container
								className="flex-nowrap justify-between flex-row-reverse"
								columns={90}
							>
								{dateRange.map((date, index) => {
									let bgColor;
									let content;

									if (isBefore(date, subDays(serviceCreateDate, 1))) {
										bgColor = 'grey.400';
										content = (
											<Typography variant="body2">اطلاعاتی در این روز در دسترس نیست</Typography>
										);
									} else {
										const dateOutages =
											outages.find((outage) =>
												isEqual(new Date(outage.date.replace(/Z|z/, '')), date)
											)?.outages ?? [];

										const sumOutages = dateOutages.reduce((sum: number, outage) => {
											return sum + outage.downtime_duration;
										}, 0);

										if (sumOutages === 0) {
											content = (
												<Typography variant="body2">در این روز قطعی وجود ندارد</Typography>
											);
										} else {
											content = (
												<Grid2
													container
													spacing={1}
												>
													<Grid2 size={12}>
														<Box
															className="py-12 px-8"
															bgcolor="grey.200"
															borderRadius={0.5}
														>
															<Typography variant="body2">
																<Typography
																	variant="body2"
																	className="font-600"
																	component="span"
																>
																	میزان قطعی:{' '}
																</Typography>
																{formatDuration(
																	{
																		hours: Math.floor(sumOutages / 3600),
																		minutes: Math.floor((sumOutages % 3600) / 60),
																		seconds: sumOutages % 60
																	},
																	{ delimiter: ' و ' }
																)}
															</Typography>
														</Box>
													</Grid2>
													<Grid2 size={12}>
														<ul
															className="list-inside p-8"
															style={{ listStyleType: 'circle' }}
														>
															{dateOutages.map((outage, index) => (
																<Typography
																	variant="body2"
																	component="li"
																	color="error.dark"
																	key={index}
																>
																	از{' '}
																	<strong>
																		{format(
																			outage.start_time.replace(/Z/, ''),
																			'HH:mm:ss'
																		)}
																	</strong>{' '}
																	تا{' '}
																	<strong>
																		{format(
																			outage.end_time.replace(/Z/, ''),
																			'HH:mm:ss'
																		)}
																	</strong>
																</Typography>
															))}
														</ul>
													</Grid2>
												</Grid2>
											);
										}

										bgColor =
											sumOutages === 0
												? 'success.main'
												: sumOutages > 5 * 60
													? 'error.main'
													: 'warning.dark';
									}

									return (
										<Grid2
											key={index}
											size={0.6}
											className="overflow-hidden"
										>
											<BarTooltip
												arrow
												title={
													<Grid2
														className="p-12"
														container
														spacing={1}
													>
														<Grid2 size={12}>
															<Typography
																variant="body1"
																className="font-500"
															>
																{format(date, 'd MMMM yyyy')}
															</Typography>
														</Grid2>
														<Grid2>{content}</Grid2>
													</Grid2>
												}
											>
												<Box
													component={motion.div}
													initial={{ y: 52 }}
													animate={{
														opacity: 1,
														y: 0,
														transition: { delay: (index + 1) * 0.01, duration: 0.3 }
													}}
													className="w-full h-52"
													bgcolor={bgColor}
													sx={{
														transition: 'filter 300',
														'&:hover': {
															filter: 'brightness(0.75)'
														}
													}}
													borderRadius={0.25}
												/>
											</BarTooltip>
										</Grid2>
									);
								})}
							</Grid2>
						</Grid2>

						<Grid2 size={12}>
							<Stack
								direction="row"
								className="relative items-center justify-between z-0"
							>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ backgroundColor: 'background.paper', paddingRight: 2 }}
								>
									امروز
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ backgroundColor: 'background.paper', paddingX: 2 }}
								>
									پایداری: {stabillityOfService}%
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ backgroundColor: 'background.paper', paddingLeft: 2 }}
								>
									90 روز گذشته
								</Typography>
								<Divider
									className="absolute top-1/2 left-0 right-0 -z-1"
									sx={{ transform: 'translateY(-50%)' }}
								/>
							</Stack>
						</Grid2>
					</Grid2>
				</Paper>
			</Grid2>
		</Grid2>
	);
}

const BarTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip
		{...props}
		classes={{ popper: className }}
	/>
))(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.background.paper,
		'&::before': {
			...theme.mixins.border(1)
		}
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.primary,
		minWidth: 244,
		maxWidth: 360,
		fontSize: theme.typography.pxToRem(12),
		...theme.mixins.border(1)
	}
}));
