import { useEffect } from 'react';
import Loading from '@components/Loading';
import { useAllEnvsQuery } from '@main/service-health/api/environments';
import { selectServiceHealthViewTabState, setServiceHealthState } from '@main/service-health/store/serviceHealthSlice';
import { Grid2 } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import EnvironmentDetails from './EnvironmentDetails';
import EnvironmentsList from './EnvironmentsList';

const View = () => {
	const { selectedEnv } = useAppSelector(selectServiceHealthViewTabState);
	const dispatch = useAppDispatch();
	const { data: envs, status } = useAllEnvsQuery();

	useEffect(() => {
		if (envs?.length && !selectedEnv) {
			dispatch(
				setServiceHealthState({
					viewTab: {
						selectedEnv: envs[0].id
					}
				})
			);
		}
	}, [envs, dispatch, selectedEnv]);

	if (status !== 'success') {
		return <Loading />;
	}

	return (
		<Grid2
			container
			spacing={2}
		>
			<Grid2 size={{ xs: 12, lg: 'auto' }}>
				<EnvironmentsList envs={envs} />
			</Grid2>
			<Grid2 size={{ xs: 12, lg: 'grow' }}>
				<EnvironmentDetails envId={selectedEnv} />
			</Grid2>
		</Grid2>
	);
};

export default View;
