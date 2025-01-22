import { useTranslation } from 'react-i18next';
import PageSimple from '@components/pageSimple';
import Button from '@mui/material/Button';
import { resetNavigationStackState, setNavigationStackStateItemSetting } from '@remate/core';

function ExampleNestedPage() {
	const { t } = useTranslation('exampleFeature');

	return (
		<PageSimple
			header={
				<div className="p-24">
					<h4>{t('EXAMPLE_NESTED_PAGE_TITLE')}</h4>
				</div>
			}
			content={
				<div className="p-24 flex flex-col gap-16">
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setNavigationStackStateItemSetting('example-details', {
								title: Math.random().toString()
							});
						}}
					>{t`CHANGE_DETAILS_PAGE_TITLE`}</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							setNavigationStackStateItemSetting('example-nested', {
								title: Math.random().toString()
							});
						}}
					>{t`CHANGE_NESTED_PAGE_TITLE`}</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							resetNavigationStackState();
						}}
					>{t`RESET_NAVIGATION_STATE`}</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							resetNavigationStackState('example-nested');
						}}
					>{t`RESET_EXAMPLE_NESTED_STACK_ITEM`}</Button>
				</div>
			}
		/>
	);
}

export default ExampleNestedPage;
