import { useMemo } from 'react';
import {
	HiMenuAlt3,
	HiMenuAlt4,
	HiOutlineArrowDown,
	HiOutlineArrowsExpand,
	HiOutlineBookmark,
	HiOutlineDotsHorizontal,
	HiOutlineDotsVertical,
	HiOutlineEyeOff,
	HiOutlineFilter,
	HiOutlineMenu,
	HiOutlineSearch,
	HiOutlineSortAscending,
	HiOutlineViewBoards,
	HiOutlineViewList
} from 'react-icons/hi';
import { Theme } from '@mui/material/styles/createTheme';
import { useAppSelector } from '@store/hooks';
import { selectCurrentLanguageId } from '@store/slices/i18nSlice';
import _ from 'lodash';
import {
	MaterialReactTable,
	MaterialReactTableProps,
	MRT_Icons,
	MRT_RowData,
	useMaterialReactTable
} from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';

import DataTableTopToolbar from './DataTableTopToolbar';

function getLocalization(languageId: string) {
	if (languageId === 'fa') {
		return MRT_Localization_FA;
	}

	return MRT_Localization_EN;
}

const tableIcons: Partial<MRT_Icons> = {
	ArrowDownwardIcon: (props: any) => (
		<HiOutlineArrowDown
			fontSize={20}
			{...props}
		/>
	),
	ClearAllIcon: () => <HiMenuAlt3 fontSize={20} />, // Adjusted, closest match
	DensityLargeIcon: () => <HiMenuAlt4 fontSize={20} />, // Adjusted, closest match
	DensityMediumIcon: () => <HiOutlineMenu fontSize={20} />, // Adjusted, closest match
	DensitySmallIcon: () => <HiOutlineViewList fontSize={20} />, // Adjusted, closest match
	DragHandleIcon: () => (
		<HiOutlineArrowsExpand
			className="rotate-45"
			fontSize={16}
		/>
	), // Adjusted, closest match
	FilterListIcon: (props: any) => (
		<HiOutlineFilter
			{...props}
			fontSize={16}
		/>
	),
	FilterListOffIcon: () => <HiOutlineFilter fontSize={20} />, // Heroicons may not have a direct match for "off" state; consider custom handling
	FullscreenExitIcon: () => <HiOutlineArrowsExpand fontSize={20} />, // Adjusted, closest match
	FullscreenIcon: () => <HiOutlineArrowsExpand fontSize={20} />,
	SearchIcon: (props: any) => (
		<HiOutlineSearch
			{...props}
			fontSize={20}
		/>
	),
	SearchOffIcon: () => <HiOutlineSearch fontSize={20} />, // Heroicons may not have a direct match for "off" state; consider custom handling
	ViewColumnIcon: () => <HiOutlineViewBoards fontSize={20} />,
	MoreVertIcon: () => <HiOutlineDotsVertical fontSize={20} />,
	MoreHorizIcon: () => <HiOutlineDotsHorizontal fontSize={20} />,
	SortIcon: (props: any) => (
		<HiOutlineSortAscending
			{...props}
			fontSize={20}
		/>
	), // Adjusted, closest match
	PushPinIcon: (props: any) => (
		<HiOutlineBookmark
			{...props}
			fontSize={20}
		/>
	), // Adjusted, closest match
	VisibilityOffIcon: () => <HiOutlineEyeOff fontSize={20} />
};

function DataTable<TData extends MRT_RowData>(props: MaterialReactTableProps<TData>) {
	const currentLanguageId = useAppSelector(selectCurrentLanguageId);
	const { columns, data, ...rest } = props;

	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				localization: getLocalization(currentLanguageId),
				initialState: {
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageSize: 10
					},
					enableFullScreenToggle: false
				},
				enableFullScreenToggle: false,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: true,
				muiBottomToolbarProps: {
					className: 'flex items-center min-h-56 h-56'
				},
				muiTablePaperProps: {
					elevation: 0,
					square: true,
					className: 'flex flex-col flex-auto h-full'
				},
				muiTableContainerProps: {
					className: 'flex-auto'
				},
				enableStickyHeader: true,
				enableStickyFooter: true,
				paginationDisplayMode: 'pages',
				positionToolbarAlertBanner: 'top',
				muiPaginationProps: {
					color: 'primary',
					rowsPerPageOptions: [10, 20, 30],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: false
				},
				muiSearchTextFieldProps: {
					placeholder: 'Search',
					sx: { minWidth: '300px' },
					variant: 'outlined',
					size: 'small'
				},
				muiFilterTextFieldProps: {
					variant: 'outlined',
					size: 'small',
					sx: {
						'& .MuiInputBase-root': {
							padding: '0px 8px',
							height: '32px!important',
							minHeight: '32px!important'
						}
					}
				},
				muiTableBodyRowProps: ({ row, table }: any) => {
					const { density } = table.getState();

					if (density === 'compact') {
						return {
							sx: {
								backgroundColor: 'initial',
								opacity: 1,
								boxShadow: 'none',
								height: row.getIsPinned() ? `${37}px` : undefined
							}
						};
					}

					return {
						sx: {
							backgroundColor: 'initial',
							opacity: 1,
							boxShadow: 'none',
							// Set a fixed height for pinned rows
							height: row.getIsPinned() ? `${density === 'comfortable' ? 53 : 69}px` : undefined
						}
					};
				},
				muiTableHeadCellProps: ({ column }: any) => ({
					sx: {
						'& .Mui-TableHeadCell-Content-Labels': {
							flex: 1,
							justifyContent: 'space-between'
						},
						'& .Mui-TableHeadCell-Content-Actions > button': {
							width: 26,
							marginLeft: 0.5,
							height: 26
						},
						'& .MuiFormHelperText-root': {
							textAlign: 'center',
							marginX: 0,
							color: (theme: Theme) => theme.palette.text.disabled,
							fontSize: 11
						},
						backgroundColor: (theme: Theme) =>
							column.getIsPinned() ? theme.palette.background.paper : 'inherit'
					}
				}),
				mrtTheme: (theme: Theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
				renderTopToolbar: (_props: any) => <DataTableTopToolbar {..._props} />,
				icons: tableIcons
			} as unknown as Partial<MaterialReactTableProps<TData>>),
		[currentLanguageId, rest]
	);

	const table = useMaterialReactTable<TData>({
		columns: columns!,
		data: data!,
		...defaults,
		...rest
	});

	return <MaterialReactTable table={table} />;
}

export default DataTable;
