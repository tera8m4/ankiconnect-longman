import { TextField, useThemeProps } from "@mui/material";
import { FormEvent, useState } from "react";

type SearchBarProps = {
    onSubmit?: (result: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (props.onSubmit) {
            props.onSubmit(searchValue);
        }
        setSearchValue('');
    }


    const [searchValue, setSearchValue] = useState('');

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                id="search-field"
                label="Search"
                variant="outlined"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
            />
        </form>
    );
}