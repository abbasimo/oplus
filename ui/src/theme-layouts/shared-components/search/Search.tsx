import { memo, ReactNode, useEffect, useReducer, useRef } from 'react';
import * as React from 'react';
import Autosuggest, { ChangeEvent, RenderInputComponentProps, RenderSuggestionParams } from 'react-autosuggest';
import { PiMagnifyingGlass, PiX } from 'react-icons/pi';
import { useNavigate } from 'react-router';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import clsx from 'clsx';
import _ from 'lodash';

import { FlatNavItemType } from '../navigation/types/NavItemType';

const Root = styled('div')(({ theme }) => ({
	'& .Search-container': {
		position: 'relative'
	},

	'& .Search-suggestionsContainerOpen': {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing(),
		left: 0,
		right: 0
	},

	'& .Search-suggestion': {
		display: 'block'
	},

	'& .Search-suggestionsList': {
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	},

	'& .Search-input': {
		transition: theme.transitions.create(['background-color'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.short
		}),
		'&:focus': {
			backgroundColor: theme.palette.background.paper
		}
	}
}));

type RenderInputComponentType = {
	variant?: 'basic' | 'standard';
	inputRef?: (node: HTMLInputElement) => void;
	ref?: (node: HTMLInputElement) => void;
	key?: string;
};

function renderInputComponent(props: RenderInputComponentProps) {
	const { variant, ref, inputRef = () => {}, key, ...other } = props as RenderInputComponentType;
	return (
		<div
			className="relative w-full"
			key={key}
		>
			{variant === 'basic' ? (
				// Outlined
				<>
					<TextField
						fullWidth
						autoComplete="off"
						InputProps={{
							name: 'auto-complete-search',
							role: 'search',
							inputRef: (node: HTMLInputElement) => {
								ref?.(node);
								inputRef(node);
							},
							classes: {
								input: 'Search-input py-0 px-16 h-40 md:h-48 ltr:pr-48 rtl:pl-48',
								notchedOutline: 'rounded-8'
							}
						}}
						variant="outlined"
						{...other}
					/>

					<PiMagnifyingGlass
						className="pointer-events-none absolute top-0 h-40 w-48 p-12 ltr:right-0 rtl:left-0 md:h-48"
						color="action"
					/>
				</>
			) : (
				// Standard
				<TextField
					fullWidth
					InputProps={{
						disableUnderline: true,
						inputRef: (node: HTMLInputElement) => {
							ref?.(node);
							inputRef(node);
						},
						classes: {
							input: 'Search-input py-0 px-16 h-48 md:h-64'
						}
					}}
					variant="standard"
					{...other}
				/>
			)}
		</div>
	);
}

function renderSuggestion(suggestion: FlatNavItemType, { query, isHighlighted }: RenderSuggestionParams) {
	const matches = match(suggestion.title, query);
	const parts = parse(suggestion.title, matches);

	return (
		<MenuItem
			selected={Boolean(isHighlighted)}
			component="div"
		>
			<ListItemIcon className="min-w-40">
				{suggestion.icon ? (
					suggestion.icon
				) : (
					<span className="w-24 text-center text-20 font-semibold uppercase">{suggestion.title[0]}</span>
				)}
			</ListItemIcon>
			<ListItemText
				primary={parts?.map((part: { text: string; highlight?: boolean }, index: number) =>
					part.highlight ? (
						<span
							key={index}
							style={{ fontWeight: 600 }}
						>
							{part.text}
						</span>
					) : (
						<strong
							key={index}
							style={{ fontWeight: 300 }}
						>
							{part.text}
						</strong>
					)
				)}
			/>
		</MenuItem>
	);
}

function getSuggestions(value: string, data: FlatNavItemType[]): FlatNavItemType[] {
	const inputValue = _.deburr(value.trim()).toLowerCase();
	const inputLength = inputValue.length;
	let count = 0;

	if (inputLength === 0) {
		return [];
	}

	return data.filter((suggestion) => {
		const keep = count < 10 && suggestion?.title && match(suggestion?.title, inputValue)?.length > 0;

		if (keep) {
			count += 1;
		}

		return keep;
	});
}

function getSuggestionValue(suggestion: FlatNavItemType) {
	return suggestion.title;
}

type StateType = {
	searchText: string;
	search: boolean;
	navigation: FlatNavItemType[];
	suggestions: FlatNavItemType[];
	noSuggestions: boolean;
	opened: boolean;
};

const initialState: StateType = {
	searchText: '',
	search: false,
	navigation: [],
	suggestions: [],
	noSuggestions: false,
	opened: false
};

type ActionType =
	| { type: 'setSearchText'; value: string }
	| { type: 'setNavigation'; data: FlatNavItemType[] }
	| { type: 'updateSuggestions'; value: string }
	| { type: 'clearSuggestions' }
	| { type: 'open' }
	| { type: 'close' };

function reducer(state: StateType, action: ActionType): StateType {
	switch (action.type) {
		case 'open': {
			return {
				...state,
				opened: true
			};
		}
		case 'close': {
			return {
				...state,
				opened: false,
				searchText: ''
			};
		}
		case 'setSearchText': {
			return {
				...state,
				searchText: action.value
			};
		}
		case 'setNavigation': {
			return {
				...state,
				navigation: action.data
			};
		}
		case 'updateSuggestions': {
			const suggestions = getSuggestions(action.value, state.navigation);
			const isInputBlank = typeof action.value === 'string' && action.value.trim() === '';
			const noSuggestions = !isInputBlank && suggestions.length === 0;

			return {
				...state,
				suggestions,
				noSuggestions
			};
		}
		case 'clearSuggestions': {
			return {
				...state,
				suggestions: [],
				noSuggestions: false
			};
		}
		default: {
			throw new Error();
		}
	}
}

/**
 * Props for Search component
 */
type SearchProps = {
	className?: string;
	navigation: FlatNavItemType[];
	variant?: 'basic' | 'full';
	trigger?: ReactNode;
	placeholder?: string;
	noResults?: string;
	tooltip?: string;
};

/**
 * Search component
 */
function Search(props: SearchProps) {
	const {
		navigation = [],
		className,
		variant = 'full',
		placeholder = 'Search',
		noResults = 'No results..',
		tooltip = 'Click to search',
		trigger = (
			<IconButton color="inherit">
				<PiMagnifyingGlass />
			</IconButton>
		)
	} = props;

	const [state, dispatch] = useReducer(reducer, initialState);
	const navigate = useNavigate();

	const suggestionsNode = useRef<HTMLDivElement>(null);
	const popperNode = useRef<HTMLDivElement>(null);
	const buttonNode = useRef(null);

	useEffect(() => {
		dispatch({
			type: 'setNavigation',
			data: navigation
		});
	}, [navigation]);

	function showSearch() {
		dispatch({ type: 'open' });
		document.addEventListener('keydown', escFunction, false);
	}

	function hideSearch() {
		dispatch({ type: 'close' });
		document.removeEventListener('keydown', escFunction, false);
	}

	function escFunction(event: KeyboardEvent) {
		if (event.key === 'Esc' || event.key === 'Escape') {
			hideSearch();
		}
	}

	function handleSuggestionsFetchRequested({ value }: { value: string }) {
		dispatch({
			type: 'updateSuggestions',
			value
		});
	}

	function handleSuggestionSelected(
		event: React.FormEvent<unknown>,
		{ suggestion }: { suggestion: FlatNavItemType }
	) {
		event.preventDefault();
		event.stopPropagation();

		if (!suggestion.url) {
			return;
		}

		navigate(suggestion.url);
		hideSearch();
	}

	function handleSuggestionsClearRequested() {
		dispatch({
			type: 'clearSuggestions'
		});
	}

	function handleChange(_event: React.FormEvent<HTMLElement>, { newValue }: ChangeEvent) {
		dispatch({
			type: 'setSearchText',
			value: newValue
		});
	}

	function handleClickAway(event: MouseEvent | TouchEvent) {
		if (
			state.opened &&
			(!suggestionsNode.current ||
				!(event.target instanceof Node && suggestionsNode.current.contains(event.target)))
		) {
			hideSearch();
		}
	}

	switch (variant) {
		case 'basic': {
			return (
				<div
					className={clsx('flex w-full items-center', className)}
					ref={popperNode}
				>
					<Autosuggest
						renderInputComponent={renderInputComponent}
						highlightFirstSuggestion
						suggestions={state.suggestions}
						onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
						onSuggestionsClearRequested={handleSuggestionsClearRequested}
						onSuggestionSelected={handleSuggestionSelected}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={{
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							variant,
							placeholder,
							role: 'search',
							value: state.searchText,
							onChange: handleChange,
							onFocus: showSearch,
							InputLabelProps: {
								shrink: true
							},
							autoFocus: false
						}}
						theme={{
							container: 'flex flex-1 w-full',
							suggestionsList: 'Search-suggestionsList',
							suggestion: 'Search-suggestion'
						}}
						renderSuggestionsContainer={(options) => {
							const { containerProps } = options;
							const { key, ...restContainerProps } = containerProps;

							return (
								<Popper
									anchorEl={popperNode.current}
									open={Boolean(options.children) || state.noSuggestions}
									className="z-9999"
								>
									<div ref={suggestionsNode}>
										<Paper
											key={key}
											{...restContainerProps}
											style={{
												width: popperNode.current ? popperNode.current.clientWidth : ''
											}}
											className="overflow-hidden rounded-8 shadow-lg"
										>
											{options.children}
											{state.noSuggestions && (
												<Typography className="px-16 py-12">{noResults}</Typography>
											)}
										</Paper>
									</div>
								</Popper>
							);
						}}
					/>
				</div>
			);
		}
		case 'full': {
			return (
				<Root className={clsx('flex', className)}>
					<Tooltip
						title={tooltip}
						placement="bottom"
					>
						<div
							onClick={showSearch}
							onKeyDown={showSearch}
							role="button"
							tabIndex={0}
							ref={buttonNode}
						>
							{trigger}
						</div>
					</Tooltip>

					{state.opened && (
						<ClickAwayListener onClickAway={handleClickAway}>
							<Paper
								className="absolute inset-x-0 top-0 z-9999 h-full shadow-0"
								square
							>
								<div
									className="flex h-full w-full items-center"
									ref={popperNode}
								>
									<Autosuggest
										renderInputComponent={renderInputComponent}
										highlightFirstSuggestion
										suggestions={state.suggestions}
										onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
										onSuggestionsClearRequested={handleSuggestionsClearRequested}
										onSuggestionSelected={handleSuggestionSelected}
										getSuggestionValue={getSuggestionValue}
										renderSuggestion={renderSuggestion}
										inputProps={{
											placeholder,
											value: state.searchText,
											onChange: handleChange,
											// eslint-disable-next-line @typescript-eslint/ban-ts-comment
											// @ts-ignore
											InputLabelProps: {
												shrink: true
											},
											autoFocus: true
										}}
										theme={{
											container: 'flex flex-1 w-full',
											suggestionsList: 'Search-suggestionsList',
											suggestion: 'Search-suggestion'
										}}
										renderSuggestionsContainer={(options) => {
											const { containerProps } = options;
											const { key, ...restContainerProps } = containerProps;

											return (
												<Popper
													anchorEl={popperNode.current}
													open={Boolean(options.children) || state.noSuggestions}
													className="z-9999"
												>
													<div ref={suggestionsNode}>
														<Paper
															square
															key={key}
															{...restContainerProps}
															className="shadow-lg"
															style={{
																width: popperNode.current
																	? popperNode.current.clientWidth
																	: 'auto'
															}}
														>
															{options.children}
															{state.noSuggestions && (
																<Typography className="px-16 py-12">
																	{noResults}
																</Typography>
															)}
														</Paper>
													</div>
												</Popper>
											);
										}}
									/>
									<IconButton
										onClick={hideSearch}
										className="mx-8"
									>
										<PiX />
									</IconButton>
								</div>
							</Paper>
						</ClickAwayListener>
					)}
				</Root>
			);
		}
		default: {
			return null;
		}
	}
}

export default memo(Search);
