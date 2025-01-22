import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { authPrivileges } from '@auth';
import PageSimple from '@components/pageSimple';
import { Button, Divider, Grid2, MenuItem, Typography } from '@mui/material';
import {
	RHFAutocomplete,
	RHFChackbox,
	RHFDatePicker,
	RHFDateTimePicker,
	RHFForm,
	RHFNumberField,
	RHFRadioGroup,
	RHFSwitch,
	RHFTextField,
	RHFTimePicker,
	RHFUpload
} from '@remate/components';
import { CanAccess, setNavigationStackStateItemSetting } from '@remate/core';

function Example() {
	const { t } = useTranslation('exampleFeature');
	const navigate = useNavigate();
	const methods = useForm();

	function setExampleDetailsTitleAndNavigate() {
		setNavigationStackStateItemSetting('example-details', {
			title: t`EXAMPLE_DETAILS_TITLE_CONFIGED_IN_EXAMPLE_PAGE`
		});

		navigate('/example/1');
	}

	return (
		<PageSimple
			header={
				<div className="p-24">
					<Typography variant="title3">{t('TITLE')}</Typography>
				</div>
			}
			content={
				<div className="w-full p-24">
					<RHFForm
						methods={methods}
						// eslint-disable-next-line no-console
						onSubmit={methods.handleSubmit((values) => console.log(values))}
					>
						<Grid2
							container
							spacing={3}
						>
							<Grid2 size={12}>
								<Typography
									variant="body1"
									fontWeight={500}
									className="mb-12"
								>
									Form Fields
								</Typography>
								<Divider />
							</Grid2>

							<Grid2 size={12}>
								<RHFTextField
									label="text field"
									name="text"
									helperText="helper text"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFTextField
									label="select label"
									name="select"
									helperText="helper text"
									select
								>
									<MenuItem value={1}>option 1</MenuItem>
									<MenuItem value={2}>option 2</MenuItem>
									<MenuItem value={3}>option 3</MenuItem>
								</RHFTextField>
							</Grid2>

							<Grid2 size={12}>
								<RHFDatePicker
									helperText="helper text"
									label="date picker"
									name="date"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFDateTimePicker
									helperText="helper text"
									label="date time picker"
									name="dateTime"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFTimePicker
									helperText="helper text"
									label="time picker"
									name="time"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFNumberField
									helperText="helper text"
									label="number field"
									name="number"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFAutocomplete
									helperText="helper text"
									label="autocomplete"
									name="autocomplete"
									options={[1, 2, 3]}
									multiple
									slotProps={{ chip: { variant: 'outlined', color: 'default' } }}
									getOptionLabel={(option) => `option ${option}`}
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFUpload
									helperText="helper text"
									label="upload label"
									name="file"
									multiple
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFChackbox
									helperText="helper text"
									label="checkbox label"
									name="checkbox"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFSwitch
									helperText="helper text"
									label="switch label"
									name="switch"
								/>
							</Grid2>

							<Grid2 size={12}>
								<RHFRadioGroup
									helperText="helper text"
									label="Radio Group"
									name="radio"
									options={[
										{ label: 'option 1', value: '1' },
										{ label: 'option 2', value: '2' },
										{ label: 'option 3', value: '3' }
									]}
								/>
							</Grid2>

							<Grid2>
								<Button
									color="primary"
									variant="contained"
									type="submit"
								>
									Submit
								</Button>
							</Grid2>
						</Grid2>
					</RHFForm>

					<CanAccess auth={authPrivileges.staff}>
						<Grid2
							container
							spacing={3}
							className="mt-48"
						>
							<Grid2 size={12}>
								<Typography
									variant="body1"
									fontWeight={500}
									className="mb-12"
								>
									Navigation
								</Typography>
								<Divider />
							</Grid2>
							<Grid2 size={12}>
								<Link to="/example/1">{t`GO_TO_EXAMPLE_DETAILS_PAGE`}</Link>
							</Grid2>
							<Grid2 size={12}>
								<Button
									variant="contained"
									color="primary"
									size="medium"
									onClick={setExampleDetailsTitleAndNavigate}
								>{t`SET_EXAMPLE_DETAILS_TITLE_AND_NAVIGATE`}</Button>
							</Grid2>
						</Grid2>
					</CanAccess>
				</div>
			}
		/>
	);
}

export default Example;
