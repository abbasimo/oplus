import { IEnvironment } from '@main/service-health/api/types';
import { selectServiceHealthViewTabState, setServiceHealthState } from '@main/service-health/store/serviceHealthSlice';
import { List, ListItemButton, listItemButtonClasses, ListItemText, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { motion } from 'framer-motion';

interface IEnvironmentsListProps {
	envs: IEnvironment[];
}

function EnvironmentsList({ envs }: IEnvironmentsListProps) {
	const { selectedEnv } = useAppSelector(selectServiceHealthViewTabState);
	const dispatch = useAppDispatch();

	const handleListItemClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
		dispatch(
			setServiceHealthState({
				viewTab: {
					selectedEnv: id
				}
			})
		);
	};

	return (
		<Paper
			component={motion.div}
			initial={{ opacity: 0, y: -12 }}
			animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
			variant="outlined"
			className="w-full min-w-288 p-12 sticky top-16 max-h-[80vh] overflow-auto"
			sx={{ backgroundColor: 'transparent', borderRadius: 1.5 }}
		>
			<List disablePadding>
				{envs.map((envInfo, index) => (
					<ListItemButton
						sx={(theme) => ({
							borderRadius: 1,
							paddingLeft: 3,
							marginBottom: index + 1 === envs.length ? undefined : 1,
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
						key={envInfo.id}
						selected={selectedEnv === envInfo.id}
						onClick={(event) => handleListItemClick(event, envInfo.id)}
					>
						<ListItemText
							primary={envInfo.title}
							classes={{ primary: 'font-400' }}
						/>
					</ListItemButton>
				))}
			</List>
		</Paper>
	);
}

export default EnvironmentsList;
