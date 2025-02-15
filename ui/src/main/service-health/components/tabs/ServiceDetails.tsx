/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactApexChart from 'react-apexcharts';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdDeveloperMode } from 'react-icons/md';
import { RiHistoryLine } from 'react-icons/ri';
import DataTable from '@components/dataTable';
import { Box, Grid2, useTheme } from '@mui/material';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { setMinutes, setSeconds } from 'date-fns';
import { eachDayOfInterval, format, formatDuration, setHours, subDays } from 'date-fns-jalali';

const today = new Date();
const ninetyDaysAgo = subDays(today, 89);

const dateRange = eachDayOfInterval({ start: ninetyDaysAgo, end: today });

interface ServiceDetailsProps {
	id: number;
}

const ServiceDetails = ({ id }: ServiceDetailsProps) => {
	const theme = useTheme();

	const series: ApexOptions['series'] = [
		{
			name: 'Uptime',
			data: dateRange.map((date, index) => ({
				fillColor:
					index < 75
						? theme.palette.grey[400]
						: index % 5 === 0
							? theme.palette.error.main
							: index % 6 === 0
								? theme.palette.warning.dark
								: theme.palette.success.main,
				x: format(date, 'd MMMM yyyy'),
				y: 1,
				meta: {
					outages:
						index % 5 !== 0
							? []
							: [
									{
										start_time: setSeconds(setMinutes(setHours(date, 10), 10), 10),
										end_time: setSeconds(setMinutes(setHours(date, 11), 11), 11),
										text: 'Outage from 2025-01-21 12:43:24 +0000 UTC to 2025-01-22 00:00:00 +0000 UTC',
										downtime_duration: 3600
									},
									{
										start_time: setSeconds(setMinutes(setHours(date, 10), 10), 10),
										end_time: setSeconds(setMinutes(setHours(date, 11), 11), 11),
										text: 'Outage from 2025-01-21 12:43:24 +0000 UTC to 2025-01-22 00:00:00 +0000 UTC',
										downtime_duration: 61
									}
								]
				}
			}))
		}
	];

	const options: ApexOptions = {
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

			custom: function ({ seriesIndex, dataPointIndex, w }) {
				const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

				let content;

				if (point.meta.outages.length) {
					const sumOutage = point.meta.outages.reduce((sum: any, outage: { downtime_duration: any }) => {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return
						return sum + outage.downtime_duration;
					}, 0);

					content = `
					<div>
						<p class="py-12 px-8" style="background-color: ${theme.palette.grey[200]}; padding: 12px 8px; border-radius: ${theme.shape.borderRadius / 2}px;"><strong>میزان قطعی: </strong> ${formatDuration({ hours: Math.floor(sumOutage / 3600), minutes: Math.floor((sumOutage % 3600) / 60), seconds: sumOutage % 60 }, { delimiter: ' و ' })}</p>
						<div class="py-12 px-8">
							<ul style="list-style-type: circle; list-style-position: inside;">
							${point.meta.outages.map((outage: { start_time: string | number | Date; end_time: string | number | Date }) => `<li style="color: ${theme.palette.error.dark}" class="mb-8">قطعی از <strong>${format(outage.start_time, 'hh:mm:ss')}</strong> تا <strong>${format(outage.end_time, 'hh:mm:ss')}</strong></li>`).join('\n')}
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

	return (
		<Paper
			sx={{ backgroundColor: 'background.default', borderRadius: 2 }}
			className="p-16"
			variant="outlined"
		>
			<Grid2 spacing={4}>
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
							className="px-32 py-12 mb-24"
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
							<IoDocumentTextOutline fontSize={24} />
							<Typography variant="title3">اطلاعات سرویس</Typography>
						</Stack>
					</Grid2>
					<Grid2 size={12}>
						<Paper
							className="px-32 py-12 mb-24"
							variant="outlined"
						></Paper>
					</Grid2>
				</Grid2>

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

export default ServiceDetails;
