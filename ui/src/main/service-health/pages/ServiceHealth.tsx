import React from 'react';
import { PiX } from 'react-icons/pi';
import Loading from '@components/Loading';
import { Box, Grid2, IconButton } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const SettingTabContent = React.lazy(() => import('../components/tabs/Setting'));
const ViewTabContent = React.lazy(() => import('../components/tabs/View'));

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			<React.Suspense fallback={<Loading className="py-80" />}>{value === index && children}</React.Suspense>
		</Box>
	);
}

interface ITab {
	label: string;
	element: React.ReactNode;
	/**
	 * @default true
	 */
	closable?: boolean;
}

interface ITabsContext {
	pushTab: (params: ITab) => void;
}

const TabsContext = React.createContext<ITabsContext | null>(null);

export function useTabsContext(): ITabsContext {
	return React.useContext(TabsContext)!;
}

export default function ServiceHealth() {
	const [tabs, setTabs] = React.useState<ITab[]>([
		{ label: 'نمایش', element: <ViewTabContent />, closable: false },
		{ label: 'تنظیمات', element: <SettingTabContent />, closable: false }
	]);
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Grid2
			container
			spacing={2}
			className="pt-20 pr-16 pb-32 pl-56"
		>
			<Grid2
				size={12}
				sx={{ borderBottom: 1, borderColor: 'divider' }}
			>
				<Tabs
					value={value}
					onChange={handleChange}
				>
					{tabs.map(({ label, closable = true }, index) => (
						<Tab
							key={index}
							label={label}
							{...(closable && {
								icon: (
									<IconButton
										size="small"
										onClick={(e) => {
											e.stopPropagation();
											setTabs((lastValue) =>
												lastValue.filter((_, tabIndex) => tabIndex !== index)
											);

											if (value > tabs.length - 2) {
												setValue((currentValue) => currentValue - 1);
											}
										}}
									>
										<PiX />
									</IconButton>
								)
							})}
						/>
					))}
				</Tabs>
			</Grid2>
			<Grid2 size={12}>
				<TabsContext.Provider
					value={{
						pushTab(newTab) {
							setTabs((lastValue) => {
								setValue(lastValue.length);
								return [...lastValue, newTab];
							});
						}
					}}
				>
					{tabs.map(({ element }, index) => (
						<CustomTabPanel
							key={index}
							value={value}
							index={index}
						>
							{element}
						</CustomTabPanel>
					))}
				</TabsContext.Provider>
			</Grid2>
		</Grid2>
	);
}
