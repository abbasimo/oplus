import { RiHistoryLine } from 'react-icons/ri';
import DataTable from '@components/dataTable';
import { Grid2, Stack, Typography } from '@mui/material';

export default function EventsSection() {
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
					<RiHistoryLine fontSize={24} />
					<Typography variant="title3">رخداد‌ها</Typography>
				</Stack>
			</Grid2>

			<Grid2 size={12}>
				<DataTable
					enableTopToolbar={false}
					data={[]}
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
	);
}
