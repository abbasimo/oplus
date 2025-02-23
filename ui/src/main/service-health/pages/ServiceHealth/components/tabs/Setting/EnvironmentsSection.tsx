import { lazy, MouseEvent, useState } from 'react';
import { PiNotePencil, PiPlusBold, PiTrash } from 'react-icons/pi';
import { RiDashboardFill, RiMore2Fill } from 'react-icons/ri';
import { pushAlertDialog, pushModal } from 'react-material-overlay';
import { useDeleteEnvMutation } from '@main/service-health/api/environments';
import { IEnvironment } from '@main/service-health/api/types';
import {
	selectServiceHealthSettingTabState,
	setServiceHealthState
} from '@main/service-health/store/serviceHealthSlice';
import {
	Button,
	Grid2,
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Paper,
	Popover,
	Radio,
	RadioGroup,
	Stack,
	Typography
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { motion } from 'framer-motion';

const CreateEnvironmentForm = lazy(() => import('./CreateEnvironmentForm'));
const UpdateEnvironmentForm = lazy(() => import('./UpdateEnvironmentForm'));

interface IEnvironmentsSectionProps {
	envs: IEnvironment[];
}

function EnvironmentsSection({ envs }: IEnvironmentsSectionProps) {
	const dispatch = useAppDispatch();
	const { selectedEnv } = useAppSelector(selectServiceHealthSettingTabState);

	return (
		<Grid2
			container
			spacing={2}
		>
			<Grid2
				container
				size={12}
				spacing={2}
				justifyContent="space-between"
				alignItems="center"
			>
				<Grid2>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
					>
						<RiDashboardFill fontSize={24} />
						<Typography variant="title3">محیط‌ها</Typography>
						<Typography color="text.secondary">({envs.length})</Typography>
					</Stack>
				</Grid2>
				<Grid2>
					<Button
						variant="outlined"
						startIcon={<PiPlusBold />}
						size="large"
						onClick={() => {
							pushModal(<CreateEnvironmentForm />, {
								modalId: 'create-environment',
								maxWidth: 'sm',
								title: 'محیط جدید'
							});
						}}
					>
						محیط جدید
					</Button>
				</Grid2>
			</Grid2>

			<Grid2
				component={RadioGroup}
				name="selectedEnv"
				value={selectedEnv}
				onChange={(evt, value) => {
					dispatch(
						setServiceHealthState({
							settingTab: {
								selectedEnv: +value
							}
						})
					);
				}}
				container
				size={12}
				spacing={1.5}
				flexWrap="nowrap"
				className="pb-8 overflow-x-auto"
			>
				{envs.map((item, index) => (
					<Grid2
						key={item.id}
						component={motion.div}
						initial={{ opacity: 0, y: -8 }}
						animate={{
							opacity: 1,
							y: 0,
							transition: { delay: (index + 1) * 0.1, duration: 0.3 }
						}}
						container
						size="auto"
					>
						<EnvironmentCard environment={item} />
					</Grid2>
				))}
			</Grid2>
		</Grid2>
	);
}

interface IEnvironmentCard {
	environment: IEnvironment;
}

function EnvironmentCard({ environment }: IEnvironmentCard) {
	const { mutate: deleteEnv } = useDeleteEnvMutation();
	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);

	const userMenuClick = (event: MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	return (
		<Paper className="p-16 relative w-[304px] h-160">
			<Grid2
				container
				spacing={1.5}
			>
				<Grid2
					container
					size={12}
					alignItems={'center'}
				>
					<Grid2 size="grow">
						<Stack
							direction="row"
							spacing={1.5}
							alignItems={'center'}
						>
							<Radio
								name="selectedEnv"
								value={environment.id}
								sx={{
									padding: 0,
									'& svg': {
										fontSize: 30
									}
								}}
							/>
							<Typography
								title={environment.title}
								fontWeight={500}
								sx={{
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis'
								}}
							>
								{environment.title}
							</Typography>
						</Stack>
					</Grid2>
					<Grid2>
						<IconButton
							color="primary"
							className="w-32 h-32 p-4"
							onClick={userMenuClick}
						>
							<RiMore2Fill fontSize={32} />
						</IconButton>
						<Popover
							open={Boolean(userMenu)}
							anchorEl={userMenu}
							onClose={userMenuClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center'
							}}
						>
							<MenuItem
								onClick={() => {
									userMenuClose();
									pushModal(<UpdateEnvironmentForm environment={environment} />, {
										maxWidth: 'sm',
										modalId: 'edit-environment',
										title: 'ویرایش محیط'
									});
								}}
							>
								<ListItemIcon>
									<PiNotePencil fontSize={24} />
								</ListItemIcon>
								<ListItemText primary="ویرایش" />
							</MenuItem>
							<MenuItem
								onClick={() => {
									userMenuClose();
									pushAlertDialog({
										alertDialogId: 'delete-environment',
										title: 'حذف محیط',
										content:
											'با حذف محیط همه سرویس های زیرمجموعه محیط حذف خواهند شد و قابل بازیابی نخواهند بود؛ آیا از حذف محیط اطمینان دارید؟',
										onConfirmOk() {
											deleteEnv(environment.id);
										},
										confirmOkButtonProps: { color: 'error' },
										confirmOkText: 'حذف محیط'
									});
								}}
								sx={{ color: 'error.main' }}
							>
								<ListItemIcon>
									<PiTrash fontSize={24} />
								</ListItemIcon>
								<ListItemText primary="حذف" />
							</MenuItem>
						</Popover>
					</Grid2>
				</Grid2>
				<Grid2 size={12}>
					<Typography
						color="textSecondary"
						title={environment.description}
						variant="body2"
						sx={{
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitBoxOrient: 'vertical',
							WebkitLineClamp: 3
						}}
					>
						{environment.description}
					</Typography>
				</Grid2>
			</Grid2>
		</Paper>
	);
}

export default EnvironmentsSection;
