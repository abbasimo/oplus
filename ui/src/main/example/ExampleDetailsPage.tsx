import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { authPrivileges } from '@auth';
import PageSimple from '@components/pageSimple';
import { Button, Skeleton } from '@mui/material';
import {
	CanAccess,
	setNavigationStackStateItemSetting,
	useNavigationStackStateItemById,
	useSetDynamicTitle
} from '@remate/core';

function ExampleDetailsPage() {
	const { t } = useTranslation('exampleFeature');
	const currentStackItem = useNavigationStackStateItemById('example-details');
	const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
	const { id } = useParams();

	// Simulating data receipt from external sources
	useEffect(() => {
		setTimeout(() => {
			setDynamicTitle(`example details ${id} dynamic title`);
		}, 1000);
	}, [id]);

	useSetDynamicTitle('example-details', dynamicTitle);

	return (
		<PageSimple
			header={
				<div className="p-24">
					{currentStackItem?.title ? (
						<h4>{currentStackItem.title}</h4>
					) : (
						<Skeleton
							variant="text"
							width={256}
							height={40}
							animation="pulse"
						/>
					)}
				</div>
			}
			content={
				<div className="p-24 flex flex-col gap-16">
					<Link to="/example/1">example details 1</Link>
					<Link to="/example/2">example details 2</Link>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setNavigationStackStateItemSetting('example-details', {
								title: t`EXAMPLE_DETAILS_DYNAMIC_TITLE`
							});
						}}
					>{t`SET_DETAILS_PAGE_TITLE`}</Button>
					<CanAccess auth={authPrivileges.admin}>
						<Link to={`/example/${id}/nested`}>{t`GO_TO_EXAMPLE_NESTED_PAGE`}</Link>
					</CanAccess>
				</div>
			}
		/>
	);
}

export default ExampleDetailsPage;
