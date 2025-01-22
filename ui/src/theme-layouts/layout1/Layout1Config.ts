export interface Layout1ConfigType {
	mode?: 'container' | 'fullwidth' | 'boxed';
	containerWidth?: number | string;
	navbar?: {
		display?: boolean;
		style?: 'style-1' | 'style-2' | 'style-3' | 'style-3-dense';
		position?: 'left' | 'right';
		open?: boolean;
		folded?: boolean;
	};
	toolbar?: {
		display?: boolean;
		style?: 'fixed' | 'static';
		displayBreadCrumbs?: boolean;
	};
	footer?: {
		display?: boolean;
		style?: 'fixed' | 'static';
	};
	leftSidePanel?: {
		display?: boolean;
	};
	rightSidePanel?: {
		display: boolean;
	};
}

const layout1DefaultConfig: Layout1ConfigType = {
	mode: 'container',
	containerWidth: 1780,
	navbar: {
		display: true,
		style: 'style-1',
		position: 'left',
		open: true,
		// use in style-2 and style-3
		folded: true
	},
	toolbar: {
		display: true,
		style: 'fixed',
		displayBreadCrumbs: true
	},
	footer: {
		display: false,
		style: 'fixed'
	},
	leftSidePanel: {
		display: true
	},
	rightSidePanel: {
		display: true
	}
};

export default layout1DefaultConfig;
