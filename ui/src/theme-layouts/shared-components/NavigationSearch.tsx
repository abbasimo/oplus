import { useTranslation } from 'react-i18next';
import { useAuth } from '@remate/core';
import { useAppSelector } from '@store/hooks';

import { selectFlatNavigation } from '../../store/slices/navigationSlice';

import Search from './search';

type NavigationSearchProps = {
	className?: string;
	variant?: 'basic' | 'full';
};

/**
 * The navigation search.
 */
function NavigationSearch(props: NavigationSearchProps) {
	const { variant, className } = props;
	const { canAccess } = useAuth();
	const { t } = useTranslation();

	const navigation = useAppSelector(selectFlatNavigation((rp) => canAccess(rp)));

	return (
		<Search
			className={className}
			variant={variant}
			navigation={navigation}
			tooltip={t('SEARCH')}
			placeholder={t('SEARCH')}
			noResults={t('NO_Result')}
		/>
	);
}

export default NavigationSearch;
