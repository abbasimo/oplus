import ReactApexChart from 'react-apexcharts';
import { IEnvironmentDetails } from '@main/service-health/api/types';
import { Box, Grid2, Paper, Stack, Typography, useTheme } from '@mui/material';
import { ApexOptions } from 'apexcharts';

interface IEnvServiceshealthStatusChartProps {
	envDetails: IEnvironmentDetails;
}

export default function EnvironmentInfoSection({ envDetails }: IEnvServiceshealthStatusChartProps) {
	const unhealthyCount = envDetails.services.filter((service) => service.status === 'unhealthy').length;
	const totalCount = envDetails.services.length;
	const healthyCount = totalCount - unhealthyCount;
	const theme = useTheme();

	const chartSeries = [
		{
			name: 'fail',
			data: [unhealthyCount],
			color: theme.palette.error.main
		},
		{
			name: 'success',
			data: [healthyCount],
			color: theme.palette.success.main
		}
	];

	return (
		<Paper
			variant="outlined"
			sx={{ backgroundColor: 'background.neutral' }}
		>
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
							series={chartSeries}
							options={chartOptions}
							type="bar"
							height={52}
							width={'100%'}
						/>
					</div>
				</Grid2>
			</Grid2>
		</Paper>
	);
}

const chartOptions: ApexOptions = {
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
