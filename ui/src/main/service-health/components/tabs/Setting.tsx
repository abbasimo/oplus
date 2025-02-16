import React, { lazy, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GrServices } from 'react-icons/gr';
import { PiEye, PiMagnifyingGlass, PiNotePencil, PiPen, PiPlusBold, PiTrash } from 'react-icons/pi';
import { RiDashboardFill, RiMore2Fill } from 'react-icons/ri';
import { pop, pushAlertDialog, pushModal } from 'react-material-overlay';
import DataTable from '@components/dataTable';
import Loading from '@components/Loading';
import {
	useAllEnvsQuery,
	useCreateEnvMutation,
	useDeleteEnvMutation,
	useEnvDetailsQuery,
	useUpdateEnvMutation
} from '@main/service-health/api/environments';
import {
	useCreateServiceMutation,
	useDeleteServiceMutation,
	useUpdateServiceMutation
} from '@main/service-health/api/services';
import { IEnviroment, IUpdateServicePayload } from '@main/service-health/api/types';
import { useTabsContext } from '@main/service-health/pages/ServiceHealth';
import {
	selectServiceHealthSettingTabState,
	setServiceHealthState
} from '@main/service-health/store/serviceHealthSlice';
import { LoadingButton } from '@mui/lab';
import { Button, Chip, Grid2, IconButton, Paper, Radio, TextField, toggleButtonGroupClasses } from '@mui/material';
import { Typography } from '@mui/material';
import { Stack } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Box } from '@mui/material';
import { ToggleButtonGroup } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Popover } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { ListItemText } from '@mui/material';
import { RHFForm, RHFNumberField, RHFTextField } from '@remate/components';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { format } from 'date-fns-jalali';
import { motion } from 'framer-motion';

const ServiceDetails = lazy(() => import('./ServiceDetails'));

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
				<Grid2
					container
					size={12}
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
									pushModal(<CreateEnviromentForm />, {
										modalId: 'create-enviroment',
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
								<EnviromentCard enviroment={item} />
							</Grid2>
						))}
					</Grid2>
				</Grid2>

				{selectedEnv && <EnvDetails envId={selectedEnv} />}
			</Grid2>
		</Paper>
	);
}

interface IEnvDetailsProps {
	envId: number;
}

function EnvDetails({ envId }: IEnvDetailsProps) {
	const { searchValue, selectedStatus } = useAppSelector(selectServiceHealthSettingTabState);
	const { mutate: deleteServiceMutate } = useDeleteServiceMutation();
	const { data: envs } = useAllEnvsQuery({ enabled: false });
	const dispatch = useAppDispatch();
	const { pushTab } = useTabsContext();

	const { data: envDetails, status: envDetailsStatus } = useEnvDetailsQuery({
		refetchInterval: 5 * 1000,
		queryPayload: envId,
		select(data) {
			let services = data.services || [];

			if (selectedStatus !== 'all') {
				services = services.filter((service) => service.status === selectedStatus);
			}

			return { ...data, services };
		}
	});

	const handleChangeStatus = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
		if (newAlignment !== null) {
			dispatch(setServiceHealthState({ settingTab: { selectedStatus: newAlignment } }));
		}
	};

	return (
		<motion.div
			className="overflow-hidden"
			initial={{ height: 0 }}
			animate={{ height: 'auto' }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
		>
			<Grid2
				key={envId}
				component={motion.div}
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.35 } }}
				container
				size={12}
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
							<GrServices fontSize={24} />
							<Typography variant="title3">
								سرویس های محیط{' '}
								<Box
									component="span"
									color="primary.main"
								>
									{envDetails?.title ?? envs?.find((env) => env.id === envId)?.title}
								</Box>
							</Typography>
						</Stack>
					</Grid2>
					<Grid2>
						<Button
							variant="outlined"
							startIcon={<PiPlusBold />}
							size="large"
							onClick={() => {
								pushModal(<CreateServiceForm envId={envId} />, {
									modalId: 'create-service',
									maxWidth: 'sm',
									title: 'ایجاد سرویس جدید'
								});
							}}
						>
							سرویس جدید
						</Button>
					</Grid2>
				</Grid2>

				<Grid2
					container
					size={12}
					spacing={1.5}
				>
					<Grid2 size={12}>
						<TextField
							value={searchValue}
							onChange={(event) => {
								dispatch(
									setServiceHealthState({
										settingTab: {
											searchValue: event.target.value
										}
									})
								);
							}}
							fullWidth
							slotProps={{
								input: {
									sx: { height: 48 },
									startAdornment: (
										<InputAdornment position="start">
											<PiMagnifyingGlass fontSize={24} />
										</InputAdornment>
									)
								}
							}}
							placeholder="جستجو"
						/>
					</Grid2>
					<Grid2 size={12}>
						<ToggleButtonGroup
							color="primary"
							value={selectedStatus}
							exclusive
							onChange={handleChangeStatus}
							sx={(theme) => ({
								backgroundColor: 'grey.300',
								'& > button': {
									borderRadius: `${theme.shape.borderRadius}px !important`,
									border: 0,
									height: 40,
									width: 78,
									fontWeight: 400,
									typography: 'body2',
									[`&.${toggleButtonGroupClasses.selected}`]: {
										fontWeight: 500
									}
								}
							})}
						>
							<ToggleButton value="all">همه</ToggleButton>
							<ToggleButton value="healthy">عملیاتی</ToggleButton>
							<ToggleButton value="unhealthy">مختل</ToggleButton>
						</ToggleButtonGroup>
					</Grid2>
					<Grid2 size={12}>
						<DataTable
							enableTopToolbar={false}
							enableRowActions
							data={envDetails?.services ?? []}
							columns={[
								{
									header: 'عنوان',
									accessorKey: 'title',
									grow: true,
									muiTableBodyCellProps: { sx: { whiteSpace: 'nowrap' } }
								},
								{
									header: 'URL',
									accessorKey: 'health_check_url',
									accessorFn(originalRow) {
										return (
											<a
												target="_blank"
												href={originalRow.health_check_url}
												dir="ltr"
												rel="noreferrer"
											>
												{originalRow.health_check_url}
											</a>
										);
									}
								},
								{
									header: 'تاریخ ایجاد',
									accessorKey: 'created_at',
									enableColumnFilter: false,
									accessorFn(originalRow) {
										return (
											<span dir="ltr">
												{format(originalRow.created_at, 'yyyy/MM/dd - HH:mm')}
											</span>
										);
									}
								},
								{
									header: 'interval',
									accessorKey: 'interval',
									accessorFn(originalRow) {
										return `${originalRow.interval} ثانیه`;
									}
								},
								{ header: 'uptime', accessorKey: 'uptime' },
								{
									header: 'وضعیت',
									accessorKey: 'status',
									enableColumnFilter: false,
									accessorFn(originalRow) {
										return (
											<Chip
												variant="filled"
												label={originalRow.status === 'healthy' ? 'عملیاتی' : 'مختل'}
												color={originalRow.status === 'healthy' ? 'success' : 'error'}
												sx={{ borderRadius: 0.5, height: 32 }}
												className="px-24 w-112"
											/>
										);
									}
								}
							]}
							enableColumnPinning
							state={{
								columnPinning: { right: ['mrt-row-actions'] },
								isLoading: envDetailsStatus !== 'success',
								globalFilter: searchValue
							}}
							renderRowActions={({ row }) => (
								<Grid2
									container
									className="flex-nowrap"
									spacing={0.5}
								>
									<Grid2>
										<Button
											size="small"
											startIcon={<PiEye />}
											onClick={() => {
												pushTab({
													label: row.original.title,
													element: <ServiceDetails id={row.original.id} />
												});

												window.scrollTo({ behavior: 'smooth', top: 0 });
											}}
										>
											جزئیات
										</Button>
									</Grid2>
									<Grid2>
										<Button
											size="small"
											startIcon={<PiPen />}
											onClick={() => {
												pushModal(
													<UpdateServiceForm
														envId={envId}
														serviceId={row.original.id}
														defaultValues={{
															title: row.original.title,
															description: row.original.description,
															health_check_url: row.original.health_check_url,
															interval: row.original.interval
														}}
													/>,
													{
														modalId: 'update-service',
														maxWidth: 'sm',
														title: 'ویرایش سرویس'
													}
												);
											}}
										>
											ویرایش
										</Button>
									</Grid2>
									<Grid2>
										<Button
											size="small"
											startIcon={<PiTrash />}
											color="error"
											onClick={() => {
												pushAlertDialog({
													alertDialogId: 'delete-service',
													title: 'حذف سرویس',
													content:
														'با حذف سرویس رخداد ها و اطلاعات مربوط به سرویس حذف خواهند شد و قابل بازیابی نخواهند بود؛ آیا از حذف سرویس اطمینان دارید؟',
													onConfirmOk() {
														deleteServiceMutate({ envId, serviceId: row.original.id });
													},
													confirmOkButtonProps: { color: 'error' },
													confirmOkText: 'حذف سرویس'
												});
											}}
										>
											حذف
										</Button>
									</Grid2>
								</Grid2>
							)}
						/>
					</Grid2>
				</Grid2>
			</Grid2>
		</motion.div>
	);
}

export interface ICreateEnviromentFormValues {
	title: string;
	description: string | null;
}

function CreateEnviromentForm() {
	const { mutate, isPending } = useCreateEnvMutation({
		onSuccess() {
			pop({ id: 'create-enviroment' });
		}
	});
	const methods = useForm<ICreateEnviromentFormValues>({
		defaultValues: {
			title: '',
			description: null
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				mutate(values);
			})}
		>
			<Grid2
				container
				spacing={2}
			>
				<Grid2 size={12}>
					<RHFTextField
						name="title"
						label="نام"
						rules={{ required: true, maxLength: 250, minLength: 1 }}
					/>
				</Grid2>
				<Grid2 size={12}>
					<RHFTextField
						label="توضیحات"
						name="description"
						multiline
						minRows={3}
						rules={{ maxLength: 2500 }}
					/>
				</Grid2>
				<Grid2 size={12}>
					<LoadingButton
						fullWidth
						type="submit"
						size="large"
						variant="contained"
						loading={isPending}
					>
						ایجاد محیط جدید
					</LoadingButton>
				</Grid2>
			</Grid2>
		</RHFForm>
	);
}

interface IEditEnviromentFormProps {
	enviroment: IEnviroment;
}

function EditEnviromentForm({ enviroment }: IEditEnviromentFormProps) {
	const { mutate, isPending } = useUpdateEnvMutation({
		onSuccess() {
			pop({ id: 'edit-enviroment' });
		}
	});
	const methods = useForm({
		defaultValues: {
			title: enviroment.title,
			description: enviroment.description
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit(({ title, description }) => {
				mutate({ envId: enviroment.id, values: { title, description: description || null } });
			})}
		>
			<Grid2
				container
				spacing={2}
			>
				<Grid2 size={12}>
					<RHFTextField
						name="title"
						label="نام"
						rules={{ required: true, maxLength: 250, minLength: 1 }}
					/>
				</Grid2>
				<Grid2 size={12}>
					<RHFTextField
						label="توضیحات"
						name="description"
						multiline
						minRows={3}
						rules={{ maxLength: 2500 }}
					/>
				</Grid2>
				<Grid2 size={12}>
					<LoadingButton
						fullWidth
						type="submit"
						size="large"
						variant="contained"
						loading={isPending}
					>
						اعمال تغییرات
					</LoadingButton>
				</Grid2>
			</Grid2>
		</RHFForm>
	);
}

interface ICreateServiceFormProps {
	envId: number;
}

function CreateServiceForm({ envId }: ICreateServiceFormProps) {
	const { mutate, isPending } = useCreateServiceMutation({
		onSuccess() {
			pop({ id: 'create-service' });
		}
	});
	const methods = useForm({
		defaultValues: {
			title: '',
			description: null,
			health_check_url: '',
			interval: 5
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				mutate({ envId, values });
			})}
		>
			<Grid2
				container
				spacing={2}
			>
				<Grid2 size={12}>
					<RHFTextField
						name="title"
						label="نام"
						rules={{ required: true, maxLength: 250, minLength: 1 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFTextField
						name="health_check_url"
						label="URL"
						placeholder="مثال: https://google.com"
						slotProps={{ input: { dir: 'ltr' } }}
						rules={{
							required: true,
							pattern: {
								value: /https?:\/\/(?:localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)(:\d+)?(\/[^\s]*)?/,
								message: 'لطفا یک URL معتبر وارد کنید'
							}
						}}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFNumberField
						name="interval"
						label="interval (seconds)"
						slotProps={{
							input: {
								inputProps: {
									dir: 'ltr'
								},
								endAdornment: <InputAdornment position="end">ثانیه</InputAdornment>
							}
						}}
						rules={{ required: true, min: 5 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFTextField
						label="توضیحات"
						name="description"
						multiline
						minRows={3}
						rules={{ maxLength: 2500 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<LoadingButton
						fullWidth
						type="submit"
						size="large"
						variant="contained"
						loading={isPending}
					>
						ایجاد سرویس
					</LoadingButton>
				</Grid2>
			</Grid2>
		</RHFForm>
	);
}

interface IUpdateServiceFormProps {
	envId: number;
	serviceId: number;
	defaultValues: IUpdateServicePayload['values'];
}

function UpdateServiceForm({ envId, serviceId, defaultValues }: IUpdateServiceFormProps) {
	const { mutate, isPending } = useUpdateServiceMutation({
		onSuccess() {
			pop({ id: 'update-service' });
		}
	});
	const methods = useForm({
		defaultValues
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				mutate({ envId, serviceId, values });
			})}
		>
			<Grid2
				container
				spacing={2}
			>
				<Grid2 size={12}>
					<RHFTextField
						name="title"
						label="نام"
						rules={{ required: true, maxLength: 250, minLength: 1 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFTextField
						name="health_check_url"
						label="URL"
						placeholder="مثال: https://google.com"
						slotProps={{ input: { dir: 'ltr' } }}
						rules={{
							required: true,
							pattern: {
								value: /https?:\/\/(?:localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)(:\d+)?(\/[^\s]*)?/,
								message: 'لطفا یک URL معتبر وارد کنید'
							}
						}}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFNumberField
						name="interval"
						label="interval (seconds)"
						slotProps={{
							input: {
								inputProps: {
									dir: 'ltr'
								},
								endAdornment: <InputAdornment position="end">ثانیه</InputAdornment>
							}
						}}
						rules={{ required: true, min: 5 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFTextField
						label="توضیحات"
						name="description"
						multiline
						minRows={3}
						rules={{ maxLength: 2500 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<LoadingButton
						fullWidth
						type="submit"
						size="large"
						variant="contained"
						loading={isPending}
					>
						ذخیره تغییرات سرویس
					</LoadingButton>
				</Grid2>
			</Grid2>
		</RHFForm>
	);
}

interface IEnviromentCard {
	enviroment: IEnviroment;
}

function EnviromentCard({ enviroment }: IEnviromentCard) {
	const { mutate: deleteEnv } = useDeleteEnvMutation();
	const [userMenu, setUserMenu] = React.useState<HTMLElement | null>(null);

	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
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
								value={enviroment.id}
								sx={{
									padding: 0,
									'& svg': {
										fontSize: 30
									}
								}}
							/>
							<Typography
								title={enviroment.title}
								fontWeight={500}
								sx={{
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis'
								}}
							>
								{enviroment.title}
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
									pushModal(<EditEnviromentForm enviroment={enviroment} />, {
										maxWidth: 'sm',
										modalId: 'edit-enviroment',
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
										alertDialogId: 'delete-enviroment',
										title: 'حذف محیط',
										content:
											'با حذف محیط همه سرویس های زیرمجموعه محیط حذف خواهند شد و قابل بازیابی نخواهند بود؛ آیا از حذف محیط اطمینان دارید؟',
										onConfirmOk() {
											deleteEnv(enviroment.id);
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
						title={enviroment.description}
						variant="body2"
						sx={{
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitBoxOrient: 'vertical',
							WebkitLineClamp: 3
						}}
					>
						{enviroment.description}
					</Typography>
				</Grid2>
			</Grid2>
		</Paper>
	);
}

export default Setting;
