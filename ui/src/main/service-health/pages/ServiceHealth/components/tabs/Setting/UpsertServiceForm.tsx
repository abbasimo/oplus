import { LoadingButton } from '@mui/lab';
import { Grid2, InputAdornment } from '@mui/material';
import { RHFNumberField, RHFTextField } from '@remate/components';

interface IUpsertServiceFormProps {
	submitting: boolean;
	submitButtonText: string;
}

function UpsertServiceForm({ submitButtonText, submitting }: IUpsertServiceFormProps) {
	return (
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
					slotProps={{
						input: {
							inputProps: {
								dir: 'ltr'
							}
						}
					}}
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
					loading={submitting}
				>
					{submitButtonText}
				</LoadingButton>
			</Grid2>
		</Grid2>
	);
}

export default UpsertServiceForm;
