import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useAppSelector } from '@store/hooks';
import { selectCurrentLanguageId } from '@store/slices/i18nSlice';
import { MaterialReactTable, MaterialReactTableProps, MRT_RowData, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';

function getLocalization(languageId: string) {
	if (languageId === 'fa') {
		return MRT_Localization_FA;
	}

	return MRT_Localization_EN;
}

const cache = createCache({
	key: 'mrt',
	prepend: true
});

function DataTable<TData extends MRT_RowData>(props: MaterialReactTableProps<TData>) {
	const currentLanguageId = useAppSelector(selectCurrentLanguageId);
	const { columns, data, ...rest } = props;

	const table = useMaterialReactTable<TData>({
		columns: columns!,
		data: data!,
		enableKeyboardShortcuts: false,
		enableColumnActions: false,
		enableFilterMatchHighlighting: true,
		enablePagination: true,
		enableSorting: true,
		localization: getLocalization(currentLanguageId),
		enableRowSelection: false,
		enableMultiRowSelection: false,
		enableBatchRowSelection: false,
		enableSelectAll: false,
		enableSubRowSelection: false,
		enableColumnResizing: true,
		enableColumnOrdering: true,
		enableToolbarInternalActions: false,
		enableRowNumbers: true,
		layoutMode: 'grid',

		muiTableProps: {
			sx: {
				'& .Mui-TableHeadCell-ResizeHandle-Divider': {
					borderWidth: 3,
					borderColor: 'transparent'
				}
			}
		},

		muiTableBodyCellProps: {
			align: 'center'
		},
		muiTableFooterCellProps: {
			align: 'center'
		},
		muiTableHeadCellProps: {
			align: 'center'
		},

		muiTableBodyRowProps: {
			hover: false
		},

		muiTableHeadProps: {
			sx: (theme) => ({
				'& .MuiTableCell-root.MuiTableCell-head, & .MuiTableCell-root[data-pinned="true"]::before': {
					backgroundColor: theme.palette.background.default
				},
				'& .MuiTableCell-root.MuiTableCell-head > .Mui-TableHeadCell-Content': {
					justifyContent: 'center'
				},
				'& th:not(:last-of-type)': {
					...theme.mixins.borderLeft(1)
				},
				'& th:last-of-type .Mui-TableHeadCell-ResizeHandle-Wrapper': {
					display: 'none'
				},
				'& th': {
					...theme.mixins.borderBottom(1),

					...(rest?.enableTopToolbar !== false && {
						...theme.mixins.borderTop(1)
					})
				}
			})
		},

		muiTableBodyProps: {
			sx: (theme) => ({
				'& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td': {
					backgroundColor: theme.palette.background.paper
				},
				'& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td': {
					backgroundColor: theme.palette.background.default
				},
				'& tr:not(:last-of-type):not([data-selected="true"]):not([data-pinned="true"]) > td': {
					...theme.mixins.borderBottom(1)
				},
				'& tr:last-of-type > td': {
					borderBottom: 0
				},
				'& tr td:not(:last-of-type)': {
					...theme.mixins.borderLeft(1)
				}
			})
		},

		muiTopToolbarProps: {
			sx: (theme) => ({
				minHeight: 64,
				'&>.MuiBox-root': {
					paddingTop: 1.5,
					paddingRight: 1,
					width: 'auto'
				},
				'& .MuiTextField-root': {
					'& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
						marginRight: 1,
						marginLeft: -0.5
					},
					'& .MuiOutlinedInput-root>svg': {
						marginLeft: 0.75,
						color: theme.palette.text.secondary,
						fill: theme.palette.text.secondary,
						marginRight: 'unset !important'
					}
				}
			})
		},

		muiBottomToolbarProps: {
			sx: (theme) => ({
				minHeight: 56,
				boxShadow: 'none',
				...theme.mixins.borderTop(1),
				'& .MuiBox-root': {
					left: 0
				},

				'& .MuiTablePagination-root': {
					width: '100%',
					'& .MuiSelect-select': {
						direction: 'ltr'
					},
					'& .MuiSelect-icon': {
						right: 0
					}
				}
			})
		},

		muiTablePaperProps: {
			variant: 'outlined'
		},

		initialState: {
			density: 'compact',
			showGlobalFilter: true,
			...rest?.initialState
		},

		...rest
	});

	return (
		<CacheProvider value={cache}>
			<MaterialReactTable table={table} />
		</CacheProvider>
	);
}

export default DataTable;
