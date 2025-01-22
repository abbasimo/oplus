import React from 'react';
import { Link } from 'react-router';
import InternalSignInForm from '@auth/services/internal/components/InternalSignInForm';
import oidcAuthService from '@auth/services/oidc/oidcAuthService';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNotification } from '@remate/core';

/**
 * The sign in page.
 */
function SignInPage() {
	const [signInLoading, setSignInLoading] = React.useState(false);
	const { open } = useNotification();

	async function handleSignInWithSSO() {
		try {
			setSignInLoading(true);
			await oidcAuthService.signInRedirect();
		} catch (error: any) {
			open?.({ type: 'error', message: error.message });
		} finally {
			setSignInLoading(false);
		}
	}

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.png"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>
					<div className="mt-2 flex items-baseline font-medium">
						<Typography>Don&apos;t have an account?</Typography>
						<Link
							className="ml-4"
							to="/sign-up"
						>
							Sign up
						</Link>
					</div>

					<div className="w-full">
						<InternalSignInForm />

						<div className="mt-32 flex items-center">
							<div className="mt-px flex-auto border-t" />
							<Typography
								className="mx-8"
								color="text.secondary"
							>
								Or continue with
							</Typography>
							<div className="mt-px flex-auto border-t" />
						</div>

						<div className="mt-32 flex items-center space-x-16">
							<LoadingButton
								loading={signInLoading}
								variant="outlined"
								className="flex-auto"
								onClick={() => handleSignInWithSSO()}
							>
								Sign in with SSO
							</LoadingButton>
						</div>
					</div>
				</CardContent>
			</Paper>

			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
				sx={{ backgroundColor: 'primary.main' }}
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'primary.light' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-64 -top-64 opacity-20"
					sx={{ color: 'primary.light' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-2xl">
					<div className="text-6xl font-bold leading-none text-gray-100">
						<div>Welcome to</div>
						<div className="text-7xl font-800 mt-8">Oplus</div>
					</div>
					<div className="mt-24 text-lg leading-6 tracking-tight text-gray-400">
						Remate helps developers to build organized and well coded dashboards full of beautiful and rich
						modules. start building your application today.
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SignInPage;
