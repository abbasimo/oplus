import { Suspense } from 'react';
import Loading from '@components/Loading';
import { Box } from '@mui/material';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export default function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			<Suspense fallback={<Loading className="py-80" />}>{value === index && children}</Suspense>
		</Box>
	);
}
