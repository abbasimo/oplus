import { RiFileSettingsFill, RiQuestionAnswerFill } from 'react-icons/ri';
import i18n from '@i18n';
import { NavItemType } from '@layouts/shared-components/navigation/types/NavItemType';

import { authPrivileges } from '../auth';

import en from './navigation-i18n/en';
import fa from './navigation-i18n/fa';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('fa', 'navigation', fa);

/**
 * The navigationConfig object is an array of navigation items for the Remate application.
 */
const navigationConfig: NavItemType[] = [
	{
		id: 'dashboard',
		title: 'DASHBOARD',
		type: 'item',
		icon: <RiQuestionAnswerFill />,
		url: '/example',
		auth: authPrivileges.user
	},
	{
		id: 'service-helth',
		title: 'SERVICE_HEALTH',
		type: 'item',
		icon: <RiQuestionAnswerFill />,
		url: '/service-health',
		auth: authPrivileges.user
	},
	{
		id: 'manage-events',
		title: 'MANAGE_EVENTS',
		type: 'item',
		icon: <RiFileSettingsFill />,
		url: '/manage-events',
		auth: authPrivileges.user
	}
];

export default navigationConfig;
