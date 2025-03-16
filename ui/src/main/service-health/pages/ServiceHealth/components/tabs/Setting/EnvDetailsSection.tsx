import { lazy, useMemo } from 'react';
import { GrServices } from 'react-icons/gr';
import { PiEye, PiPen, PiPlusBold, PiTrash } from 'react-icons/pi';
import { pushAlertDialog, pushModal } from 'react-material-overlay';
import DataTable from '@components/dataTable';
import { useAllEnvsQuery, useEnvDetailsQuery } from '@main/service-health/api/environments';
import { useDeleteServiceMutation } from '@main/service-health/api/services';
import { IService } from '@main/service-health/api/types';
import {
	selectServiceHealthSettingTabState,
	setServiceHealthState
} from '@main/service-health/store/serviceHealthSlice';
import { Box, Button, Chip, Grid2, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { format, formatDuration } from 'date-fns-jalali';
import { AnimatePresence, motion } from 'framer-motion';
import { MRT_ColumnDef } from 'material-react-table';

import FilterStatusField from '../../FilterStatusField';
import SearchField from '../../SearchField';
import { useTabsContext } from '../../TabContext';

const ServiceDetails = lazy(() => import('../ServiceDetails'));
const CreateServiceForm = lazy(() => import('./CreateServiceForm'));
const UpdateServiceForm = lazy(() => import('./UpdateServiceForm'));

interface IEnvDetailsSectionProps {
	envId: number;
}

function EnvDetailsSection({ envId }: IEnvDetailsSectionProps) {
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

	const handleChangeStatus = (newValue: string) => {
		dispatch(setServiceHealthState({ settingTab: { selectedStatus: newValue } }));
	};

	const columns = useMemo<MRT_ColumnDef<IService>[]>(
		() => [
			{
				header: 'عنوان',
				accessorKey: 'title',
				grow: true,
				muiTableBodyCellProps: { sx: { whiteSpace: 'nowrap' } }
			},
			{
				header: 'URL',
				accessorKey: 'health_check_url',
				Cell: ({ cell }) => {
					return (
						<a
							target="_blank"
							href={cell.getValue<string>()}
							dir="ltr"
							rel="noreferrer"
						>
							{cell.renderValue<string>()}
						</a>
					);
				}
			},
			{
				header: 'تاریخ ایجاد',
				accessorKey: 'created_at',
				enableColumnFilter: false,
				accessorFn(originalRow) {
					return <span dir="ltr">{format(originalRow.created_at, 'yyyy/MM/dd - HH:mm')}</span>;
				}
			},
			{
				header: 'interval',
				accessorKey: 'interval',
				accessorFn(originalRow) {
					return `${originalRow.interval} ثانیه`;
				}
			},
			{
				header: 'uptime',
				grow: true,
				muiTableBodyCellProps: { sx: { whiteSpace: 'nowrap' } },
				accessorFn: ({ uptime }) =>
					uptime
						? formatDuration(
								{
									days: Math.floor(uptime / (3600 * 24)),
									hours: Math.floor(uptime / 3600 / 24),
									minutes: Math.floor((uptime % 3600) / 60),
									seconds: uptime % 60
								},
								{ delimiter: ' و ' }
							)
						: '-'
			},
			{
				header: 'وضعیت',
				enableColumnFilter: false,
				maxSize: 144,
				accessorKey: 'status',
				Cell: ({ row }) => {
					return (
						<Chip
							variant="filled"
							label={row.original.status === 'healthy' ? 'عملیاتی' : 'مختل'}
							color={row.original.status === 'healthy' ? 'success' : 'error'}
							sx={{ borderRadius: 0.5, height: 32 }}
							className="px-24 w-112"
						/>
					);
				}
			}
		],
		[]
	);

	return (
		<AnimatePresence>
			<motion.div
				className="overflow-hidden"
				initial={{ height: 0 }}
				animate={{ height: 'auto' }}
				transition={{ delay: 0.1, duration: 0.2, ease: 'easeInOut' }}
			>
				<Grid2
					key={envId}
					component={motion.div}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.35 } }}
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
							<SearchField
								value={searchValue}
								onChange={(value) => {
									dispatch(
										setServiceHealthState({
											settingTab: {
												searchValue: value
											}
										})
									);
								}}
							/>
						</Grid2>
						<Grid2 size={12}>
							<FilterStatusField
								value={selectedStatus}
								onChange={handleChangeStatus}
							/>
						</Grid2>
						<Grid2 size={12}>
							<DataTable
								enableTopToolbar={false}
								enableRowActions
								data={envDetails?.services ?? []}
								columns={columns}
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
														element: (
															<ServiceDetails
																envId={envId}
																serviceId={row.original.id}
															/>
														)
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
															service={row.original}
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
		</AnimatePresence>
	);
}

export default EnvDetailsSection;
