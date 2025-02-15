import { lazy, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import Highlighter from 'react-highlight-words';
import { PiMagnifyingGlass } from 'react-icons/pi';
import { TiArrowLeft } from 'react-icons/ti';
import Loading from '@components/Loading';
import { useAllEnvsQuery, useEnvDetailsQuery } from '@main/service-health/api/environments';
import { IEnviromentDetails } from '@main/service-health/api/types';
import { useTabsContext } from '@main/service-health/pages/ServiceHealth';
import { selectServiceHealthViewTabState, setServiceHealthState } from '@main/service-health/store/serviceHealthSlice';
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid2,
	InputAdornment,
	List,
	ListItemButton,
	listItemButtonClasses,
	ListItemText,
	Paper,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	toggleButtonGroupClasses,
	Typography
} from '@mui/material';
import { searchInString } from '@remate/core';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { ApexOptions } from 'apexcharts';

const ServiceDetails = lazy(() => import('./ServiceDetails'));

const View = () => {
	const { selectedEnv } = useAppSelector(selectServiceHealthViewTabState);
	const dispatch = useAppDispatch();
	const { data, status } = useAllEnvsQuery();

	useEffect(() => {
		if (data?.length && !selectedEnv) {
			dispatch(
				setServiceHealthState({
					viewTab: {
						selectedEnv: data[0].id
					}
				})
			);
		}
	}, [data, dispatch, selectedEnv]);

	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
		dispatch(
			setServiceHealthState({
				viewTab: {
					selectedEnv: id
				}
			})
		);
	};

	if (status !== 'success') {
		return <Loading />;
	}

	return (
		<Grid2
			container
			spacing={2}
		>
			<Grid2 size={{ xs: 12, lg: 'auto' }}>
				<Paper
					variant="outlined"
					className="w-full min-w-288 p-12 sticky top-16 max-h-[80vh] overflow-auto"
					sx={{ backgroundColor: 'transparent', borderRadius: 1.5 }}
				>
					<List disablePadding>
						{data.map((item, index) => (
							<ListItemButton
								sx={(theme) => ({
									borderRadius: 1,
									paddingLeft: 3,
									marginBottom: index + 1 === data.length ? undefined : 1,
									[`&.${listItemButtonClasses.selected}`]: {
										color: theme.palette.primary.main,
										'&::before': {
											content: '""',
											position: 'absolute',
											left: 8,
											height: 24,
											width: 3,
											backgroundColor: theme.palette.primary.main,
											borderRadius: theme.shape.borderRadius * 0.5
										}
									}
								})}
								className="py-12"
								key={item.id}
								selected={selectedEnv === item.id}
								onClick={(event) => handleListItemClick(event, item.id)}
							>
								<ListItemText
									primary={item.title}
									classes={{ primary: 'font-400' }}
								/>
							</ListItemButton>
						))}
					</List>
				</Paper>
			</Grid2>
			<Grid2 size={{ xs: 12, lg: 'grow' }}>
				<EnvDetails envId={selectedEnv} />
			</Grid2>
		</Grid2>
	);
};

interface IEnvServiceshealthStatusChartProps {
	envDetails: IEnviromentDetails;
}

const EnvServiceshealthStatusChart = ({ envDetails }: IEnvServiceshealthStatusChartProps) => {
	const unhealthyCount = envDetails.services.filter((service) => service.status === 'unhealthy').length;
	const totalCount = envDetails.services.length;
	const healthyCount = totalCount - unhealthyCount;

	const series = [
		{
			name: 'fail',
			data: [unhealthyCount],
			color: '#D32F2F'
		},
		{
			name: 'success',
			data: [healthyCount],
			color: '#355E5B'
		}
	];

	const options: ApexOptions = {
		chart: {
			type: 'bar',
			toolbar: { show: false },
			stacked: true,
			stackType: '100%'
		},
		plotOptions: {
			bar: {
				horizontal: true,
				barHeight: 8,
				isFunnel: true
			}
		},
		xaxis: {
			categories: [''],
			labels: { show: false },
			axisBorder: { show: false },
			axisTicks: { show: false }
		},
		yaxis: {
			labels: { show: false },
			axisBorder: { show: false },
			axisTicks: { show: false }
		},
		grid: {
			show: false
		},
		dataLabels: {
			enabled: false
		},
		tooltip: {
			enabled: false
		},
		fill: {
			opacity: 1
		},
		legend: {
			show: false
		}
	};

	return (
		<Grid2
			container
			spacing={{ xs: 3, lg: 10 }}
			className="items-center px-32 py-16"
		>
			<Grid2 size={{ xs: 12, lg: 'auto' }}>
				<Typography
					variant="body1"
					fontWeight={500}
				>
					{envDetails.title}
				</Typography>
				<Typography variant="caption1">{envDetails.description}</Typography>
			</Grid2>
			<Grid2 size={{ xs: 12, lg: 'grow' }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					className="px-16 -mb-20"
				>
					<Typography
						variant="body2"
						color="textSecondary"
					>
						وضعیت سلامت سرویس ها
					</Typography>

					<Stack
						direction="row"
						alignItems="center"
						spacing={1.5}
						useFlexGap
					>
						<Typography
							variant="body1"
							fontWeight={400}
						>
							{totalCount} /{' '}
							<Typography
								variant="body1"
								color="error"
								component="span"
								fontWeight={400}
							>
								{unhealthyCount}
							</Typography>
						</Typography>
						<Box
							width={8}
							height={8}
							bgcolor="error.main"
							className="-mt-4"
							sx={{ transform: 'rotateZ(45deg)' }}
						/>
					</Stack>
				</Stack>
				<div className="-mb-16">
					<ReactApexChart
						series={series}
						options={options}
						type="bar"
						height={52}
						width={'100%'}
					/>
				</div>
			</Grid2>
		</Grid2>
	);
};

interface IEnvDetailsProps {
	envId?: number;
}

function EnvDetails({ envId }: IEnvDetailsProps) {
	const { searchValue, selectedStatus } = useAppSelector(selectServiceHealthViewTabState);
	const dispatch = useAppDispatch();
	const { data: envDetails, status } = useEnvDetailsQuery({
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

	const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
		if (newAlignment !== null) {
			dispatch(
				setServiceHealthState({
					viewTab: {
						selectedStatus: newAlignment
					}
				})
			);
		}
	};

	if (status !== 'success') {
		return <Loading />;
	}

	if (!envDetails?.services?.length) {
		return <h1>سرویسی برای این محیط ثبت نشده است</h1>;
	}

	return (
		<Paper
			sx={{ backgroundColor: 'background.default', borderRadius: 2 }}
			className="p-16"
			variant="outlined"
		>
			<Grid2
				container
				spacing={3}
			>
				<Grid2 size={12}>
					<Paper
						variant="outlined"
						sx={{ backgroundColor: 'background.neutral' }}
					>
						<EnvServiceshealthStatusChart
							envDetails={envDetails}
							key={envId}
						/>
					</Paper>
				</Grid2>
				<Grid2
					container
					size={12}
					spacing={1.5}
				>
					<Grid2 size={12}>
						<TextField
							value={searchValue}
							onChange={(event) => {
								dispatch(
									setServiceHealthState({
										viewTab: {
											searchValue: event.target.value
										}
									})
								);
							}}
							fullWidth
							slotProps={{
								input: {
									sx: { height: 48 },
									startAdornment: (
										<InputAdornment position="start">
											<PiMagnifyingGlass fontSize={24} />
										</InputAdornment>
									)
								}
							}}
							placeholder="جستجو"
						/>
					</Grid2>
					<Grid2 size={12}>
						<ToggleButtonGroup
							color="primary"
							value={selectedStatus}
							exclusive
							onChange={handleAlignment}
							sx={(theme) => ({
								backgroundColor: 'grey.300',
								'& > button': {
									borderRadius: `${theme.shape.borderRadius}px !important`,
									border: 0,
									height: 40,
									width: 78,
									fontWeight: 400,
									typography: 'body2',
									[`&.${toggleButtonGroupClasses.selected}`]: {
										fontWeight: 500
									}
								}
							})}
						>
							<ToggleButton value="all">همه</ToggleButton>
							<ToggleButton value="healthy">عملیاتی</ToggleButton>
							<ToggleButton value="unhealthy">مختل</ToggleButton>
						</ToggleButtonGroup>
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
										size={{ xs: 12, md: 6, lg: 4 }}
									>
										<Paper className="p-12">
											<Grid2
												container
												spacing={1}
												justifyContent="flex-end"
											>
												<Grid2
													container
													size={12}
													spacing={1.5}
													className="items-center"
												>
													<Grid2 size="grow">
														<Typography
															variant="body2"
															fontWeight={500}
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
													<Grid2 size={12}>
														<Typography
															variant="caption1"
															color="textSecondary"
														>
															<Highlighter
																searchWords={[searchValue]}
																autoEscape={true}
																textToHighlight={item.description}
															/>
														</Typography>
													</Grid2>
												</Grid2>
												<Grid2>
													<Button
														onClick={() => {
															pushTab({
																label: item.title,
																element: <ServiceDetails id={item.id} />
															});

															window.scrollTo({ behavior: 'smooth', top: 0 });
														}}
														size="small"
														sx={(theme) => ({
															'.MuiButton-endIcon': {
																transition: theme.transitions.create('margin', {
																	easing: theme.transitions.easing.sharp,
																	duration: theme.transitions.duration.leavingScreen
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
	);
}

export default View;
