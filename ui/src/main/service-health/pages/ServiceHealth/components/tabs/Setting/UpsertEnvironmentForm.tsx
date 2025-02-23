import { LoadingButton } from '@mui/lab';
import { Grid2 } from '@mui/material';
import { RHFTextField } from '@remate/components';

interface IUpsertEnvironmentFormProps {
	submitting: boolean;
	submitButtonText: string;
}

function UpsertEnvironmentForm({ submitButtonText, submitting }: IUpsertEnvironmentFormProps) {
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

export default UpsertEnvironmentForm;
