import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useAuth, useNotification } from '@remate/core';
import { isAxiosError } from 'axios';
import _ from 'lodash';
import { z } from 'zod';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.')
});

type FormType = {
	email: string;
	password: string;
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function InternalSignInForm() {
	const { open } = useNotification();
	const { control, formState, handleSubmit, setValue } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors, isSubmitting } = formState;
	const { signIn } = useAuth();

	useEffect(() => {
		setValue('email', 'admin@gmail.com', { shouldDirty: true, shouldValidate: true });
		setValue('password', 'admin', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	async function onSubmit(formData: FormType) {
		const { email, password } = formData;

		try {
			await signIn('internal', {
				email,
				password
			});
		} catch (error: any) {
			if (isAxiosError<{ message: string }[]>(error)) {
				open?.({ type: 'error', message: error.response?.data[0].message ?? '' });
			} else {
				open?.({ type: 'error', message: error.message });
			}
		}
	}

	return (
		<form
			name="loginForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>
			</div>

			<LoadingButton
				loading={isSubmitting}
				variant="contained"
				color="primary"
				className=" mt-16 w-full"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Sign in
			</LoadingButton>
		</form>
	);
}

export default InternalSignInForm;
