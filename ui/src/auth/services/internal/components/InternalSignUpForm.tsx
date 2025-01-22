import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { useAuth, useNotification } from '@remate/core';
import { isAxiosError } from 'axios';
import _ from 'lodash';
import { z } from 'zod';

import { SignUpPayload } from '../internalAuthService';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		displayName: z.string().nonempty('You must enter your name'),
		email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
		password: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		passwordConfirm: z.string().nonempty('Password confirmation is required'),
		acceptTermsConditions: z.boolean().refine((val) => val === true, 'The terms and conditions must be accepted.')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

const defaultValues = {
	displayName: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};

function InternalSignUpForm() {
	const { signUp } = useAuth();
	const { open } = useNotification();
	const { control, formState, handleSubmit } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors, isSubmitting } = formState;

	async function onSubmit(formData: SignUpPayload) {
		const { displayName, email, password } = formData;

		try {
			await signUp('internal', {
				displayName,
				password,
				email
			});
		} catch (error: unknown) {
			if (isAxiosError<{ message: string }[]>(error)) {
				open?.({ type: 'error', message: error.response?.data[0].message ?? error.message });
			} else {
				open?.({ type: 'error', message: (error as Error).message });
			}
		}
	}

	return (
		<form
			name="registerForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="displayName"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Display name"
						autoFocus
						type="name"
						error={!!errors.displayName}
						helperText={errors?.displayName?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
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

			<Controller
				name="passwordConfirm"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password (Confirm)"
						type="password"
						error={!!errors.passwordConfirm}
						helperText={errors?.passwordConfirm?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="acceptTermsConditions"
				control={control}
				render={({ field }) => (
					<FormControl
						className="items-center"
						error={!!errors.acceptTermsConditions}
					>
						<FormControlLabel
							label="I agree to the Terms of Service and Privacy Policy"
							control={
								<Checkbox
									size="small"
									{...field}
								/>
							}
						/>
						<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
					</FormControl>
				)}
			/>

			<LoadingButton
				loading={isSubmitting}
				variant="contained"
				color="primary"
				className="mt-24 w-full"
				aria-label="Register"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Create your free account
			</LoadingButton>
		</form>
	);
}

export default InternalSignUpForm;
