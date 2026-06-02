import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';

export default function ReactSelect({ options = [], value = '', label = 'react-select', onChange, enableMultiple = false }) {
    const selectValue = enableMultiple ? (Array.isArray(value) ? value : [value]) : value;
    return (
        <FormControl fullWidth>
            <InputLabel id="simple-select-label">{label}</InputLabel>
            <Select
                labelId="simple-select-label"
                id="simple-select"
                value={selectValue}
                label={label}
                onChange={onChange}
                multiple={enableMultiple}
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

