import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';

export interface ITab {
	label: string;
	element: React.ReactNode;
	/**
	 * @default true
	 */
	closable?: boolean;
}

export interface ITabsContext {
	tabs: ITab[];
	focusedTabIndex: number;
	setFocusedTabIndex: Dispatch<SetStateAction<number>>;
	setTabs: Dispatch<SetStateAction<ITab[]>>;
	pushTab: (params: ITab) => void;
}

const TabsContext = createContext<ITabsContext | null>(null);

export function useTabsContext(): ITabsContext {
	const tabContext = useContext(TabsContext);

	if (tabContext === null) {
		throw new Error('');
	}

	return tabContext;
}

interface ITabsContextProviderProps {
	defaultTabs?: ITab[];
	children: ReactNode;
}

export default function TabsContextProvider({ defaultTabs = [], children }: ITabsContextProviderProps) {
	const [tabs, setTabs] = useState<ITab[]>(defaultTabs);
	const [focusedTabIndex, setFocusedTabIndex] = useState(0);

	const pushTab = useCallback((newTab: ITab) => {
		setTabs((lastValue) => {
			setFocusedTabIndex(lastValue.length);
			return [...lastValue, { closable: true, ...newTab }];
		});
	}, []);

	const contextValue = useMemo<ITabsContext>(
		() => ({
			tabs,
			focusedTabIndex,
			pushTab,
			setFocusedTabIndex,
			setTabs
		}),
		[focusedTabIndex, pushTab, tabs]
	);

	return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}
