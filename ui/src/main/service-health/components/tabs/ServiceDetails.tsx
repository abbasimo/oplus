import { ReactNode } from 'react';
import ReactApexChart from 'react-apexcharts';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdDeveloperMode } from 'react-icons/md';
import { RiHistoryLine } from 'react-icons/ri';
import DataTable from '@components/dataTable';
import Loading from '@components/Loading';
import { useServiceDetailsQuery, useServiceOutagesQuery } from '@main/service-health/api/services';
import { IOutage } from '@main/service-health/api/types';
import { Box, Grid2, useTheme } from '@mui/material';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { eachDayOfInterval, format, formatDuration, isBefore, isEqual, subDays } from 'date-fns-jalali';

const today = new Date();
const ninetyDaysAgo = subDays(today, 89);

const dateRange = eachDayOfInterval({ start: ninetyDaysAgo, end: today });

interface ServiceDetailsProps {
	envId: number;
	serviceId: number;
}

const ServiceDetails = ({ envId, serviceId }: ServiceDetailsProps) => {
	const { data: serviceDetails, status } = useServiceDetailsQuery({
		queryPayload: { envId, serviceId },
		refetchInterval: 5 * 1000
	});

	if (status !== 'success') {
		return <Loading />;
	}

	return (
		<Paper
			sx={{ backgroundColor: 'background.default', borderRadius: 2 }}
			className="p-16"
			variant="outlined"
		>
			<Grid2
				container
				spacing={4}
			>
				<Grid2 size={12}>
					<HealthStatusSection
						serviceCreateDate={serviceDetails.created_at}
						envId={envId}
						serviceId={serviceId}
					/>
				</Grid2>
				<Grid2
					size={12}
					container
					spacing={2}
				>
					<Grid2 size={12}>
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
						>
							<IoDocumentTextOutline fontSize={24} />
							<Typography variant="title3">اطلاعات سرویس</Typography>
						</Stack>
					</Grid2>
					<Grid2
						size={12}
						container
						spacing={2}
					>
						<Grid2 size={12}>
							<Paper
								className="p-16"
								variant="outlined"
							>
								<Typography
									variant="body1"
									fontWeight={500}
								>
									{serviceDetails.title}
								</Typography>
								<Typography variant="body2">{serviceDetails.description}</Typography>
							</Paper>
						</Grid2>
						<Grid2 size={{ xs: 12, md: 6, lg: 4, xl: 'grow' }}>
							<ServiceInformationCard
								label="وضعیت"
								content={serviceDetails.status === 'healthy' ? 'عملیاتی' : 'مختل'}
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, md: 6, lg: 4, xl: 'grow' }}>
							<ServiceInformationCard
								label="uptime"
								content={
									serviceDetails.uptime
										? formatDuration(
												{
													days: Math.floor(serviceDetails.uptime / (3600 * 24)),
													hours: Math.floor(serviceDetails.uptime / 3600 / 24),
													minutes: Math.floor((serviceDetails.uptime % 3600) / 60),
													seconds: serviceDetails.uptime % 60
												},
												{ delimiter: ' و ' }
											)
										: '-'
								}
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, md: 6, lg: 4, xl: 'grow' }}>
							<ServiceInformationCard
								label="URL"
								content={
									<a
										target="_blank"
										href={serviceDetails.health_check_url}
										dir="ltr"
										rel="noreferrer"
									>
										{serviceDetails.health_check_url}
									</a>
								}
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, md: 6, lg: 4, xl: 'grow' }}>
							<ServiceInformationCard
								label="تاریخ ایجاد"
								content={
									<span dir="ltr">{format(serviceDetails.created_at, 'yyyy/MM/dd - HH:mm')}</span>
								}
							/>
						</Grid2>
						<Grid2 size={{ xs: 12, md: 6, lg: 4, xl: 'grow' }}>
							<ServiceInformationCard
								label="interval"
								content={`${serviceDetails.interval} ثانیه`}
							/>
						</Grid2>
					</Grid2>
				</Grid2>

				<Grid2
					size={12}
					container
					spacing={2}
				>
					<Grid2 size={12}>
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
						>
							<RiHistoryLine fontSize={24} />
							<Typography variant="title3">رخداد‌ها</Typography>
						</Stack>
					</Grid2>

					<Grid2 size={12}>
						<DataTable
							enableTopToolbar={false}
							data={new Array(1000).fill({
								title: 'تایتل تستی',
								health_check_url: 'https://google.com',
								created_at: '1403/08/01',
								interval: '5',
								uptime: 0,
								status: 'unhealthy'
							})}
							columns={[
								{ header: 'عنوان', accessorKey: 'title' },
								{ header: 'URL', accessorKey: 'health_check_url' },
								{ header: 'تاریخ ایجاد', accessorKey: 'created_at' },
								{ header: 'interval', accessorKey: 'interval' },
								{ header: 'uptime', accessorKey: 'uptime' },
								{ header: 'وضعیت', accessorKey: 'status' }
							]}
						/>
					</Grid2>
				</Grid2>
			</Grid2>
		</Paper>
	);
};

interface IServiceInformationCardProps {
	label: string;
	content: ReactNode;
}

function ServiceInformationCard({ label, content }: IServiceInformationCardProps) {
	return (
		<Paper
			className="p-16"
			variant="outlined"
		>
			<Typography
				variant="caption1"
				className="mb-8 block"
			>
				{label}
			</Typography>
			<Typography
				variant="body1"
				fontWeight={500}
			>
				{content}
			</Typography>
		</Paper>
	);
}

interface IHealthStatusSectionProps {
	envId: number;
	serviceId: number;
	serviceCreateDate: string;
}

function HealthStatusSection({ envId, serviceId, serviceCreateDate }: IHealthStatusSectionProps) {
	const { data: outages, status } = useServiceOutagesQuery({
		queryPayload: {
			envId,
			serviceId
		}
	});

	const theme = useTheme();

	if (status !== 'success') {
		return <Loading />;
	}

	const options: ApexOptions = {
		states: {
			hover: {
				filter: {
					type: 'dark'
				}
			},
			active: {
				filter: {
					type: 'none'
				}
			}
		},
		dataLabels: {
			enabled: false
		},
		chart: {
			type: 'bar',
			toolbar: { show: false }
		},
		plotOptions: {
			bar: {
				horizontal: false,
				borderRadius: 2,
				barHeight: 40,
				columnWidth: '64%'
			}
		},
		xaxis: {
			labels: { show: false },
			axisTicks: { show: false },
			axisBorder: { show: false }
		},
		yaxis: {
			show: false
		},
		grid: {
			show: false
		},
		tooltip: {
			enabled: true,
			followCursor: true,
			marker: {
				show: true
			},
			intersect: true,
			inverseOrder: true,

			custom: function ({ seriesIndex, dataPointIndex, w }) {
				const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

				if (!point.meta) {
					return null;
				}

				let content;

				if (point.meta.outages.length) {
					content = `
					<div>
						<p class="py-12 px-8" style="background-color: ${theme.palette.grey[200]}; padding: 12px 8px; border-radius: ${theme.shape.borderRadius / 2}px;"><strong>میزان قطعی: </strong> ${formatDuration({ hours: Math.floor(point.meta.sumOutages / 3600), minutes: Math.floor((point.meta.sumOutages % 3600) / 60), seconds: point.meta.sumOutages % 60 }, { delimiter: ' و ' })}</p>
						<div class="py-12 px-8">
							<ul style="list-style-type: circle; list-style-position: inside;">
							${point.meta.outages.map((outage: IOutage) => `<li style="color: ${theme.palette.error.dark}" class="mb-4">قطعی از <strong>${format(outage.start_time.replace(/Z/, ''), 'HH:mm:ss')}</strong> تا <strong>${format(outage.end_time.replace(/Z/, ''), 'HH:mm:ss')}</strong></li>`).join('\n')}
							</ul>
						</div>
					</div>
					`;
				} else {
					content = '<p>در این روز قطعی وجود ندارد.</p>';
				}

				return `
				  <div dir="rtl" class="flex flex-wrap gap-12 p-16">
                    <div class="basis-full">
				        <strong>${point.x}</strong>
                    </div>
                    <div class="basis-full">
						${content}
                    </div>
				  </div>`;
			}
		}
	};

	const series: ApexOptions['series'] = [
		{
			name: 'Uptime',
			data: dateRange.map((date) => {
				if (isBefore(date, serviceCreateDate)) {
					return {
						fillColor: theme.palette.grey[400],
						x: format(date, 'd MMMM yyyy'),
						y: 1
					};
				}

				const dateOutages =
					outages.find((outage) => isEqual(new Date(outage.date.replace(/Z|z/, '')), date))?.outages ?? [];

				const sumOutages = dateOutages.reduce((sum: number, outage) => {
					return sum + outage.downtime_duration;
				}, 0);

				return {
					fillColor:
						sumOutages === 0
							? theme.palette.success.main
							: sumOutages > 5 * 60
								? theme.palette.error.main
								: theme.palette.warning.dark,
					x: format(date, 'd MMMM yyyy'),
					y: 1,
					meta: {
						sumOutages,
						outages: dateOutages ?? []
					}
				};
			})
		}
	];

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
					className="px-32 py-12"
					variant="outlined"
				>
					<ReactApexChart
						options={options}
						series={series}
						type="bar"
						height={100}
					/>
					<Box mt={-2}>
						<Divider />
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							sx={{ transform: 'translateY(-50%)' }}
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
								پایداری: 99.91%
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ backgroundColor: 'background.paper', paddingLeft: 2 }}
							>
								90 روز گذشته
							</Typography>
						</Stack>
					</Box>
				</Paper>
			</Grid2>
		</Grid2>
	);
}

export default ServiceDetails;
