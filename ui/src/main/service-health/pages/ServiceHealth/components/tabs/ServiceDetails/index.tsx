import Loading from '@components/Loading';
import { useServiceDetailsQuery, useServiceOutagesQuery } from '@main/service-health/api/services';
import { Grid2 } from '@mui/material';
import { Paper } from '@mui/material';
import { motion } from 'framer-motion';

import EventsSection from './EventsSection';
import HealthStatusSection from './HealthStatusSection';
import ServiceInfoSection from './ServiceInfoSection';

interface ServiceDetailsProps {
	envId: number;
	serviceId: number;
}

const ServiceDetails = ({ envId, serviceId }: ServiceDetailsProps) => {
	const { data: serviceDetails, status: serviceDetailsStatus } = useServiceDetailsQuery({
		queryPayload: { envId, serviceId },
		refetchInterval: 5 * 1000
	});

	const { data: outages, status: outagesStatus } = useServiceOutagesQuery({
		queryPayload: {
			envId,
			serviceId
		},
		refetchInterval: 5 * 1000
	});

	if (serviceDetailsStatus !== 'success' || outagesStatus !== 'success') {
		return <Loading />;
	}

	return (
		<Paper
			sx={{ backgroundColor: 'background.default', borderRadius: 2 }}
			className="p-16 overflow-hidden"
			variant="outlined"
		>
			<Grid2
				container
				spacing={4}
			>
				<Grid2
					size={12}
					component={motion.div}
					initial={{ opacity: 0, x: 32 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.3 } }}
				>
					<HealthStatusSection
						serviceCreateDate={serviceDetails.created_at}
						outages={outages}
					/>
				</Grid2>

				<Grid2
					size={12}
					component={motion.div}
					initial={{ opacity: 0, x: -32 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.3 } }}
				>
					<ServiceInfoSection serviceDetails={serviceDetails} />
				</Grid2>

				<Grid2
					size={12}
					component={motion.div}
					initial={{ opacity: 0, x: 32 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.6, duration: 0.3 } }}
				>
					<EventsSection />
				</Grid2>
			</Grid2>
		</Paper>
	);
};

export default ServiceDetails;
