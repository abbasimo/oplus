import { lazy } from 'react';
import { Grid2 } from '@mui/material';

import TabsContextProvider from './components/TabContext';
import Tabs from './components/Tabs';
import TabsContent from './components/TabsContent';

const SettingTabContent = lazy(() => import('./components/tabs/Setting'));
const ViewTabContent = lazy(() => import('./components/tabs/View'));

const defaultTabs = [
	{ label: 'نمایش', element: <ViewTabContent />, closable: false },
	{ label: 'تنظیمات', element: <SettingTabContent />, closable: false }
];

export default function ServiceHealth() {
	return (
		<TabsContextProvider defaultTabs={defaultTabs}>
			<Grid2
				container
				spacing={2}
				className="pt-20 pr-16 pb-32 pl-56"
			>
				<Grid2
					size={12}
					sx={{ borderBottom: 1, borderColor: 'divider' }}
				>
					<Tabs />
				</Grid2>
				<Grid2 size={12}>
					<TabsContent />
				</Grid2>
			</Grid2>
		</TabsContextProvider>
	);
}
