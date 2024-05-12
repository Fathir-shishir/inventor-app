import { useState } from "react";

const AutocompleteExample = () => {
    const [value, setValue] = useState();
    const [form, setForm] = useState({id: ""});
    const [options, setOptions] = useState([
        {id: 1, title: "Title 1"},
        {id: 2, title: "Title 2"},
        {id: 3, title: "Title 3"},
    ])

    return (
        <Autocomplete
            value={form.id}
            onChange={(event, newValue) => setForm(prev => ({ ...prev, id: newValue }))}
            options={options}
            getOptionLabel={(option) => {
                return option?.title || ""
            }}
            isOptionEqualToValue={(option, value) =>
                option?.title === value?.title
            }
            renderInput={params => (
                <BlueTextField {...params} label="Example Autocomplete" />
            )}
        />
    )
}

export default AutocompleteExample