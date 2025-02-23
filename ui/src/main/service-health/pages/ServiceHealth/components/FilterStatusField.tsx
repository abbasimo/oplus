import { ToggleButton, ToggleButtonGroup, toggleButtonGroupClasses } from '@mui/material';

interface iFilterStatusFieldProps {
	value: string;
	onChange: (newValue: string) => void;
}

function FilterStatusField({ value, onChange }: iFilterStatusFieldProps) {
	return (
		<ToggleButtonGroup
			color="primary"
			value={value}
			exclusive
			onChange={(_evt, newValue: string | null) => {
				if (newValue !== null) {
					onChange(newValue);
				}
			}}
			sx={(theme) => ({
				backgroundColor: 'grey.300',
				'& > button': {
					borderRadius: `${theme.shape.borderRadius}px !important`,
					border: 0,
					height: 40,
					width: 78,
					fontWeight: 400,
					typography: 'body2',
					[`&.${toggleButtonGroupClasses.selected}`]: {
						fontWeight: 500
					}
				}
			})}
		>
			<ToggleButton value="all">همه</ToggleButton>
			<ToggleButton value="healthy">عملیاتی</ToggleButton>
			<ToggleButton value="unhealthy">مختل</ToggleButton>
		</ToggleButtonGroup>
	);
}

export default FilterStatusField;
