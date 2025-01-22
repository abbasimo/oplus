/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Breadcrumbs, Link, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useNavigationStackState } from '@remate/core';

function BreadCrumbs() {
	const { t } = useTranslation('navigation');
	const navigationStackState = useNavigationStackState();

	return (
		<Breadcrumbs
			separator={<Separator />}
			maxItems={4}
		>
			{navigationStackState.map(({ title, pathname, dynamicTitle }, index) => {
				const isLastItem = index === navigationStackState.length - 1;

				if (dynamicTitle && !title) {
					if (isLastItem) {
						return <TitleSkeleton key={pathname} />;
					}

					return (
						<RouterLink
							to={pathname}
							key={pathname}
							className="!no-underline"
						>
							<TitleSkeleton />
						</RouterLink>
					);
				}

				const _title = t(title!);

				return isLastItem ? (
					<Typography
						color="primary.light"
						key={pathname}
						className="max-w-256 text-ellipsis overflow-hidden block"
						title={_title}
						variant="body2"
					>
						{_title}
					</Typography>
				) : (
					<Link
						component={RouterLink}
						to={pathname}
						key={pathname}
						underline="hover"
						color="inherit"
						className="max-w-256 text-ellipsis overflow-hidden block"
						title={_title}
						variant="body2"
					>
						{_title}
					</Link>
				);
			})}
		</Breadcrumbs>
	);
}

const TitleSkeleton = React.memo(function TitleSkeletonComponent() {
	const { t } = useTranslation();

	return (
		<Skeleton
			variant="text"
			width={72}
			height={30}
			animation="pulse"
			title={t`LOADING`}
		/>
	);
});

function Separator() {
	return (
		<Box
			component="span"
			sx={{
				width: 4,
				height: 4,
				borderRadius: '50%',
				bgcolor: 'text.disabled'
			}}
		/>
	);
}

export default React.memo(BreadCrumbs);
