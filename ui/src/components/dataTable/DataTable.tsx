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

function DataTable<TData extends MRT_RowData>(props: MaterialReactTableProps<TData>) {
	const currentLanguageId = useAppSelector(selectCurrentLanguageId);
	const { columns, data, ...rest } = props;

	const table = useMaterialReactTable<TData>({
		columns: columns!,
		data: data!,
		columnFilterDisplayMode: 'popover',
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
		enableColumnOrdering: false,
		enableToolbarInternalActions: false,
		enableRowNumbers: false,

		muiTableProps: {
			sx: {
				'& .Mui-TableHeadCell-ResizeHandle-Divider': {
					borderWidth: 3,
					borderColor: 'transparent'
				},
				'& .MuiTableCell-root[data-pinned="true"]': {
					overflow: 'visible',
					'&::after': {
						content: '" "',
						width: '1px',
						height: '50%',
						backgroundColor: 'divider',
						position: 'absolute',
						top: '50%',
						left: -1,
						transform: 'translateY(-50%)'
					}
				},
				'& .MuiTableCell-root[data-pinned="true"]::before': {
					boxShadow: 'none',
					backgroundColor: 'unset'
				}
			}
		},

		muiTableBodyCellProps: {
			align: 'left',
			sx: {
				padding: 1.5
			}
		},
		muiTableFooterCellProps: {
			align: 'left'
		},
		muiTableHeadCellProps: {
			align: 'left'
		},

		muiTableBodyRowProps: {
			hover: false
		},

		muiTableHeadProps: {
			sx: (theme) => ({
				'& .MuiTableCell-root.MuiTableCell-head, & .MuiTableCell-root[data-pinned="true"]::before': {
					backgroundColor: theme.palette.background.default,
					fontWeight: 400,
					padding: theme.spacing(1.75, 1.5)
				},
				'& .Mui-TableHeadCell-Content-Labels': {
					flexDirection: 'row'
				},
				'& .MuiTableCell-root.MuiTableCell-head > .Mui-TableHeadCell-Content': {
					flexDirection: 'row',
					'& .MuiIconButton-root': {
						width: 'auto',
						height: 'auto',
						padding: 0
					}
				},
				'& th:not(:last-of-type)': {
					position: 'relative',
					'&::after': {
						content: '" "',
						width: '1px',
						height: '50%',
						backgroundColor: 'divider',
						position: 'absolute',
						top: '50%',
						right: 0,
						transform: 'translateY(-50%)'
					}
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
				'& tr:nth-of-type(odd):not([data-selected="true"]) > td': {
					backgroundColor: theme.palette.background.paper
				},
				'& tr:nth-of-type(even):not([data-selected="true"]) > td': {
					backgroundColor: theme.palette.background.default
				},
				'& tr:not(:last-of-type):not([data-selected="true"]) > td': {
					...theme.mixins.borderBottom(1)
				},
				'& tr:last-of-type > td': {
					borderBottom: 0
				},
				'& tr td:not(:last-of-type)': {
					position: 'relative',
					'&::after': {
						content: '" "',
						width: '1px',
						height: '50%',
						backgroundColor: 'divider',
						position: 'absolute',
						top: '50%',
						right: 0,
						transform: 'translateY(-50%)'
					}
				}
			})
		},

		muiTopToolbarProps: {
			sx: (theme) => ({
				minHeight: 64,
				'&>.MuiBox-root': {
					paddingTop: 1.5,
					width: 'auto'
				},
				'& .MuiTextField-root': {
					'& .MuiOutlinedInput-root>svg': {
						color: theme.palette.text.secondary,
						fill: theme.palette.text.secondary
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

					'& .MuiSelect-icon': {
						right: 4
					}
				}
			})
		},

		muiTablePaperProps: {
			variant: 'outlined'
		},

		initialState: {
			density: 'comfortable',
			showGlobalFilter: true,
			...rest?.initialState
		},

		...rest
	});

	return <MaterialReactTable table={table} />;
}

export default DataTable;
