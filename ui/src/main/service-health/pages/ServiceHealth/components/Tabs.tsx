import { PiX } from 'react-icons/pi';
import { IconButton, Tab, Tabs as MuiTabs } from '@mui/material';

import { useTabsContext } from './TabContext';

function Tabs() {
	const { tabs, setTabs, focusedTabIndex, setFocusedTabIndex } = useTabsContext();

	return (
		<MuiTabs
			value={focusedTabIndex}
			onChange={(_event: React.SyntheticEvent, newValue: number) => {
				setFocusedTabIndex(newValue);
			}}
		>
			{tabs.map(({ label, closable }, index) => (
				<Tab
					key={index}
					label={label}
					title={label}
					iconPosition="end"
					{...(closable && {
						icon: (
							<IconButton
								LinkComponent={'span'}
								size="small"
								title="بستن"
								onClick={(e) => {
									e.stopPropagation();
									setTabs((lastValue) => lastValue.filter((_, tabIndex) => tabIndex !== index));

									if (focusedTabIndex > tabs.length - 2) {
										setFocusedTabIndex((currentValue) => currentValue - 1);
									}
								}}
							>
								<PiX />
							</IconButton>
						)
					})}
				/>
			))}
		</MuiTabs>
	);
}

export default Tabs;
