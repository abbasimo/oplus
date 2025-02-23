import { ReactNode } from 'react';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { IService } from '@main/service-health/api/types';
import { Paper } from '@mui/material';
import { Grid2, Stack, Typography } from '@mui/material';
import { format, formatDuration } from 'date-fns-jalali';

interface IServiceInfoSectionProps {
	serviceDetails: IService;
}

export default function ServiceInfoSection({ serviceDetails }: IServiceInfoSectionProps) {
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
						content={<span dir="ltr">{format(serviceDetails.created_at, 'yyyy/MM/dd - HH:mm')}</span>}
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
	);
}

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
