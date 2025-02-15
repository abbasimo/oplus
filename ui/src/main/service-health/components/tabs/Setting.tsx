import React, { lazy } from 'react';
import { useForm } from 'react-hook-form';
import { GrServices } from 'react-icons/gr';
import { PiEye, PiMagnifyingGlass, PiPen, PiPlusBold, PiTrash } from 'react-icons/pi';
import { RiDashboardFill, RiMore2Fill } from 'react-icons/ri';
import { pushModal } from 'react-material-overlay';
import DataTable from '@components/dataTable';
import Loading from '@components/Loading';
import { useAllEnvsQuery, useEnvDetailsQuery } from '@main/service-health/api/environments';
import { IEnviroment } from '@main/service-health/api/types';
import { useTabsContext } from '@main/service-health/pages/ServiceHealth';
import { Button, Grid2, IconButton, Paper, Radio, TextField, toggleButtonGroupClasses } from '@mui/material';
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
import { format } from 'date-fns-jalali';
import { motion } from 'framer-motion';
import { isNumber } from 'lodash';

const ServiceDetails = lazy(() => import('./ServiceDetails'));

function Setting() {
	const [selectedEnviroment, setSelectedEnviroment] = React.useState<number | null>(null);
	const { data: envs, status } = useAllEnvsQuery();

	const [alignment, setAlignment] = React.useState<string | null>('left');
	const { pushTab } = useTabsContext();

	const { data: envDetails, status: envDetailsStatus } = useEnvDetailsQuery({
		enabled: !!selectedEnviroment,
		queryPayload: selectedEnviroment as number
	});

	const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
		if (newAlignment !== null) {
			setAlignment(newAlignment);
		}
	};

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
								<Typography color="text.secondary">(4)</Typography>
							</Stack>
						</Grid2>
						<Grid2>
							<Button
								variant="outlined"
								startIcon={<PiPlusBold />}
								size="large"
								onClick={() => {
									pushModal(<CreateEnviromentForm />, {
										modalId: 'create-enviroment-form',
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
						name="selectedEnviroment"
						value={selectedEnviroment}
						onChange={(evt) => setSelectedEnviroment(+evt.target.value)}
						container
						size={12}
						spacing={1.5}
						flexWrap="nowrap"
						className="pb-8 overflow-x-auto"
					>
						{envs.map((item) => (
							<Grid2
								key={item.id}
								size="auto"
							>
								<EnviromentCard enviroment={item} />
							</Grid2>
						))}
					</Grid2>
				</Grid2>

				{isNumber(selectedEnviroment) && (
					<Grid2
						key={selectedEnviroment}
						component={motion.div}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.35 } }}
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
											{envDetails?.title}
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
										pushModal(<CreateServiceForm />, {
											modalId: 'create-service-form',
											maxWidth: 'sm',
											title: 'سرویس جدید برای محیط 2'
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
									value={alignment}
									exclusive
									onChange={handleAlignment}
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
									<ToggleButton value="left">همه</ToggleButton>
									<ToggleButton value="center">عملیاتی</ToggleButton>
									<ToggleButton value="right">مختل</ToggleButton>
								</ToggleButtonGroup>
							</Grid2>
							<Grid2 size={12}>
								<DataTable
									enableTopToolbar={false}
									enableRowActions
									data={envDetails?.services ?? []}
									columns={[
										{ header: 'عنوان', accessorKey: 'title' },
										{ header: 'URL', accessorKey: 'health_check_url' },
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
										{ header: 'وضعیت', accessorKey: 'status' }
									]}
									enableColumnPinning
									state={{
										columnPinning: { right: ['mrt-row-actions'] },
										isLoading: envDetailsStatus !== 'success'
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
												>
													ویرایش
												</Button>
											</Grid2>
										</Grid2>
									)}
								/>
							</Grid2>
						</Grid2>
					</Grid2>
				)}
			</Grid2>
		</Paper>
	);
}

function CreateEnviromentForm() {
	const methods = useForm();

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				// eslint-disable-next-line no-console
				console.log(values);
			})}
		>
			<Grid2
				container
				spacing={2}
			>
				<Grid2 size={12}>
					<RHFTextField
						name="name"
						label="نام"
						rules={{ required: true, maxLength: 30, minLength: 1 }}
					/>
				</Grid2>
				<Grid2 size={12}>
					<RHFTextField
						label="توضیحات"
						name="desc"
						multiline
						minRows={3}
						rules={{ maxLength: 300 }}
					/>
				</Grid2>
				<Grid2 size={12}>
					<Button
						fullWidth
						type="submit"
						size="large"
						variant="contained"
					>
						ایجاد محیط جدید
					</Button>
				</Grid2>
			</Grid2>
		</RHFForm>
	);
}

function CreateServiceForm() {
	const methods = useForm();

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				// eslint-disable-next-line no-console
				console.log(values);
			})}
		>
			<Grid2
				container
				spacing={2}
			>
				<Grid2 size={12}>
					<RHFTextField
						name="name"
						label="نام"
						rules={{ required: true, maxLength: 30, minLength: 1 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFTextField
						name="url"
						label="URL"
						placeholder="https://google.com"
						slotProps={{ input: { dir: 'ltr' } }}
						rules={{ required: true }}
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
						rules={{ required: true, min: 3 }}
						defaultValue={5}
					/>
				</Grid2>

				<Grid2 size={12}>
					<RHFTextField
						label="توضیحات"
						name="desc"
						multiline
						minRows={3}
						rules={{ maxLength: 300 }}
					/>
				</Grid2>

				<Grid2 size={12}>
					<Button
						fullWidth
						type="submit"
						size="large"
						variant="contained"
					>
						ایجاد سرویس جدید
					</Button>
				</Grid2>
			</Grid2>
		</RHFForm>
	);
}

interface IEnviromentCard {
	enviroment: IEnviroment;
}

function EnviromentCard({ enviroment }: IEnviromentCard) {
	const [userMenu, setUserMenu] = React.useState<HTMLElement | null>(null);

	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	return (
		<Paper className="p-16 relative w-[264px] h-160">
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
								name="selectedEnviroment"
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
							<MenuItem sx={{ color: 'error.main' }}>
								<ListItemIcon>
									<PiTrash fontSize={24} />
								</ListItemIcon>
								<ListItemText primary="حذف محیط" />
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
