import { lazy, useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import { TiArrowLeft } from 'react-icons/ti';
import Loading from '@components/Loading';
import { useEnvDetailsQuery } from '@main/service-health/api/environments';
import { selectServiceHealthViewTabState, setServiceHealthState } from '@main/service-health/store/serviceHealthSlice';
import { Button, Chip, Divider, Grid2, Paper, Stack, Typography } from '@mui/material';
import { searchInString } from '@remate/core';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { AnimatePresence, motion } from 'framer-motion';

const ServiceDetails = lazy(() => import('../ServiceDetails'));

import FilterStatusField from '../../FilterStatusField';
import SearchField from '../../SearchField';
import { useTabsContext } from '../../TabContext';

import EnvironmentInfoSection from './EnvironmentInfoSection';

interface IEnvironmentDetailsProps {
	envId?: number;
}

export default function EnvironmentDetails({ envId }: IEnvironmentDetailsProps) {
	const { searchValue, selectedStatus } = useAppSelector(selectServiceHealthViewTabState);
	const dispatch = useAppDispatch();
	const { data: envDetails, status } = useEnvDetailsQuery({
		refetchInterval: 5 * 1000,
		enabled: !!envId,
		queryPayload: envId as number
	});

	const { pushTab } = useTabsContext();

	const services = useMemo(() => {
		if (!envDetails?.services) {
			return [];
		}

		let services = envDetails.services;

		if (selectedStatus !== 'all') {
			services = services.filter((service) => service.status === selectedStatus);
		}

		if (searchValue.length) {
			services = services.filter(
				(service) =>
					searchInString(service.title, searchValue.toLocaleLowerCase()) ||
					searchInString(service.description, searchValue.toLocaleLowerCase())
			);
		}

		return services;
	}, [envDetails?.services, searchValue, selectedStatus]);

	const handleChangeStatus = (newSelectedStatus: string) => {
		dispatch(
			setServiceHealthState({
				viewTab: {
					selectedStatus: newSelectedStatus
				}
			})
		);
	};

	if (status !== 'success') {
		return <Loading />;
	}

	if (!envDetails?.services?.length) {
		return <h1>سرویسی برای این محیط ثبت نشده است</h1>;
	}

	return (
		<AnimatePresence>
			<Paper
				key={envId}
				component={motion.div}
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.3 } }}
				exit={{ opacity: 0, x: -100, transition: { duration: 0.25 } }}
				sx={{ backgroundColor: 'background.default', borderRadius: 2 }}
				className="p-16"
				variant="outlined"
			>
				<Grid2
					container
					spacing={3}
				>
					<Grid2 size={12}>
						<EnvironmentInfoSection envDetails={envDetails} />
					</Grid2>

					<Grid2
						container
						size={12}
						spacing={1.5}
					>
						<Grid2 size={12}>
							<SearchField
								value={searchValue}
								onChange={(value) => {
									dispatch(
										setServiceHealthState({
											viewTab: {
												searchValue: value
											}
										})
									);
								}}
							/>
						</Grid2>
						<Grid2 size={12}>
							<FilterStatusField
								value={selectedStatus}
								onChange={handleChangeStatus}
							/>
						</Grid2>
					</Grid2>

					<Grid2
						size={12}
						container
					>
						<Grid2 size={12}>
							<Stack spacing={1}>
								<Typography variant="title3">سرویس‌ها</Typography>
								<Divider />
							</Stack>
						</Grid2>
						<Grid2
							size={12}
							container
							spacing={2}
						>
							{services.length
								? services.map((item) => (
										<Grid2
											key={item.id}
											size={{ xs: 12, md: 6, xl: 4 }}
										>
											<Paper className="p-12 h-[156px]">
												<Grid2
													container
													spacing={1.5}
													flexDirection="column"
													className="h-full"
													flexWrap="nowrap"
												>
													<Grid2
														container
														spacing={1.5}
														className="items-center"
													>
														<Grid2 size="grow">
															<Typography
																variant="body2"
																fontWeight={500}
																title={item.title}
																sx={{
																	whiteSpace: 'nowrap',
																	overflow: 'hidden',
																	textOverflow: 'ellipsis'
																}}
															>
																<Highlighter
																	className=""
																	searchWords={[searchValue]}
																	autoEscape={true}
																	textToHighlight={item.title}
																/>
															</Typography>
														</Grid2>
														<Grid2 size="auto">
															<Chip
																variant="filled"
																label={item.status === 'healthy' ? 'عملیاتی' : 'مختل'}
																color={item.status === 'healthy' ? 'success' : 'error'}
																sx={{ borderRadius: 0.5, height: 36 }}
																className="px-24"
															/>
														</Grid2>
													</Grid2>
													<Grid2 size="grow">
														<Typography
															variant="caption1"
															color="textSecondary"
															title={item.description}
															sx={{
																overflow: 'hidden',
																display: '-webkit-box',
																WebkitBoxOrient: 'vertical',
																WebkitLineClamp: 2,
																lineHeight: 1.5
															}}
														>
															<Highlighter
																searchWords={[searchValue]}
																autoEscape={true}
																textToHighlight={item.description}
															/>
														</Typography>
													</Grid2>
													<Grid2 alignSelf="flex-end">
														<Button
															onClick={() => {
																pushTab({
																	label: item.title,
																	element: (
																		<ServiceDetails
																			envId={envDetails.id}
																			serviceId={item.id}
																		/>
																	)
																});

																window.scrollTo({ behavior: 'smooth', top: 0 });
															}}
															size="small"
															sx={(theme) => ({
																'.MuiButton-endIcon': {
																	transition: theme.transitions.create('margin', {
																		easing: theme.transitions.easing.sharp,
																		duration:
																			theme.transitions.duration.leavingScreen
																	})
																},
																'&:hover': {
																	'.MuiButton-endIcon': {
																		marginLeft: 1.5
																	}
																}
															})}
															endIcon={<TiArrowLeft style={{ fontSize: 24 }} />}
														>
															بررسی بیشتر
														</Button>
													</Grid2>
												</Grid2>
											</Paper>
										</Grid2>
									))
								: 'سرویسی یافت نشد'}
						</Grid2>
					</Grid2>
				</Grid2>
			</Paper>
		</AnimatePresence>
	);
}
