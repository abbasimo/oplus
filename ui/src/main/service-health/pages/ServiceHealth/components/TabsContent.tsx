import { useTabsContext } from './TabContext';
import TabPanel from './TabPanel';

function TabsContent() {
	const { tabs, focusedTabIndex } = useTabsContext();

	return tabs.map(({ element }, index) => (
		<TabPanel
			key={index}
			value={focusedTabIndex}
			index={index}
		>
			{element}
		</TabPanel>
	));
}

export default TabsContent;
