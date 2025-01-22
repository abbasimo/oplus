import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiLock, PiSignOut, PiUserPlus } from 'react-icons/pi';
import { pushAlertDialog } from 'react-material-overlay';
import { Link } from 'react-router';
import { User } from '@auth/user';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { darken } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useAuth } from '@remate/core';

/**
 * The user menu.
 */
function UserMenu() {
	const { signOut, user } = useAuth<User>();
	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
	const { t } = useTranslation();

	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	if (!user) {
		return null;
	}

	return (
		<>
			<Button
				className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
				onClick={userMenuClick}
				color="inherit"
			>
				<div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						variant="body2"
						component="span"
						className="flex font-semibold"
					>
						{user.data.displayName}
					</Typography>
					<Typography
						variant="caption1"
						className="capitalize"
						color="text.secondary"
					>
						{user.role?.toString()}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.data.photoURL ? (
					<Avatar
						sx={{
							background: (theme) => theme.palette.background.default,
							color: (theme) => theme.palette.text.secondary
						}}
						className="md:mx-4"
						alt="user photo"
						src={user.data.photoURL}
					/>
				) : (
					<Avatar
						sx={{
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: (theme) => theme.palette.text.secondary
						}}
						className="md:mx-4"
					>
						{user?.data?.displayName?.[0]}
					</Avatar>
				)}
			</Button>

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
				{!user.role || user.role.length === 0 ? (
					<>
						<MenuItem
							component={Link}
							to="/sign-in"
							role="button"
						>
							<ListItemIcon>
								<PiLock fontSize={24} />
							</ListItemIcon>
							<ListItemText primary="Sign In" />
						</MenuItem>
						<MenuItem
							component={Link}
							to="/sign-up"
							role="button"
						>
							<ListItemIcon>
								<PiUserPlus fontSize={24} />
							</ListItemIcon>
							<ListItemText primary="Sign up" />
						</MenuItem>
					</>
				) : (
					<MenuItem
						onClick={() => {
							pushAlertDialog({
								title: t`SIGN_OUT`,
								content: t`SIGN_OUT_CONFIRM_DIALOG`,
								confirmOkButtonProps: { color: 'error' },
								confirmOkText: t('SIGN_OUT'),
								onConfirmOk: () => signOut()
							});
						}}
					>
						<ListItemIcon>
							<PiSignOut fontSize={24} />
						</ListItemIcon>
						<ListItemText primary={t('SIGN_OUT')} />
					</MenuItem>
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
