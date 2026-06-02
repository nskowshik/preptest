import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';

export default function ReactSelect({ options = [], value = '', label = 'react-select', onChange }) {
    return (
        <FormControl fullWidth>
            <InputLabel id="simple-select-label">{label}</InputLabel>
            <Select
                labelId="simple-select-label"
                id="simple-select"
                value={value}
                label={label}
                onChange={onChange}
            >
                {options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option?.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

