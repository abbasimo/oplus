import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentNavigationStackStateItem } from '@remate/core';

function DocumentTitleHandler() {
	const { t: globalT } = useTranslation();
	const { t } = useTranslation('navigation');
	const currentNavigationStackStateItem = useCurrentNavigationStackStateItem();

	const appTitle = globalT`APP_TITLE`;
	const showPageTitle =
		currentNavigationStackStateItem &&
		(currentNavigationStackStateItem.title ?? currentNavigationStackStateItem.dynamicTitle);

	const documentTitle = showPageTitle
		? `${appTitle} | ${
				currentNavigationStackStateItem.title
					? t(currentNavigationStackStateItem.title)
					: `${globalT`LOADING`}...`
			}`
		: appTitle;

	return (
		<article>
			<title>{documentTitle}</title>
		</article>
	);
}

export default React.memo(DocumentTitleHandler);
