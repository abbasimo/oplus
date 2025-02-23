export interface Layout3ConfigType {
	mode?: 'container' | 'fullwidth' | 'boxed';
	containerWidth?: number | string;
	scroll?: 'content' | 'body';
	navbar?: {
		display?: boolean;
		style?: 'static' | 'fixed';
	};
	toolbar?: {
		display?: boolean;
		style?: 'fixed' | 'static';
		displayBreadCrumbs?: boolean;
		position?: 'below' | 'above';
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

const layout3DefaultConfig: Layout3ConfigType = {
	mode: 'container',
	containerWidth: 1280,
	scroll: 'content',
	navbar: {
		display: true,
		style: 'fixed'
	},
	toolbar: {
		display: true,
		style: 'static',
		position: 'below',
		displayBreadCrumbs: true
	},
	footer: {
		display: true,
		style: 'fixed'
	},
	leftSidePanel: {
		display: true
	},
	rightSidePanel: {
		display: true
	}
};

export default layout3DefaultConfig;
