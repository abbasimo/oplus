import { useEffect } from 'react';
import Loading from '@components/Loading';
import { useAllEnvsQuery } from '@main/service-health/api/environments';
import {
	selectServiceHealthSettingTabState,
	setServiceHealthState
} from '@main/service-health/store/serviceHealthSlice';
import { Grid2, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import EnvDetailsSection from './EnvDetailsSection';
import EnvironmentsSection from './EnvironmentsSection';

function Setting() {
	const { selectedEnv } = useAppSelector(selectServiceHealthSettingTabState);
	const dispatch = useAppDispatch();
	const { data: envs, status } = useAllEnvsQuery();

	useEffect(() => {
		if (selectedEnv && envs?.findIndex((env) => env.id === selectedEnv) === -1) {
			dispatch(
				setServiceHealthState({
					settingTab: {
						selectedEnv: null
					}
				})
			);
		}
	}, [dispatch, envs, selectedEnv]);

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
					<EnvironmentsSection envs={envs} />
				</Grid2>

				{selectedEnv && (
					<Grid2 size={12}>
						<EnvDetailsSection envId={selectedEnv} />
					</Grid2>
				)}
			</Grid2>
		</Paper>
	);
}

export default Setting;
