import { PiMagnifyingGlass } from 'react-icons/pi';
import { InputAdornment, TextField } from '@mui/material';

interface ISearchFieldProps {
	value: string;
	onChange: (value: string) => void;
}

function SearchField({ onChange, value }: ISearchFieldProps) {
	return (
		<TextField
			value={value}
			onChange={(event) => {
				onChange(event.target.value);
			}}
			fullWidth
			slotProps={{
				input: {
					sx: { height: 48 },
					startAdornment: (
						<InputAdornment position="start">
							<PiMagnifyingGlass fontSize={24} />
						</InputAdornment>
					)
				}
			}}
			placeholder="جستجو"
		/>
	);
}

export default SearchField;
