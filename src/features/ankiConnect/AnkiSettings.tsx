import { Box, Button, FormControl, InputLabel, MenuItem, Table, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ankiSettingsSlice } from "./ankiConnectSlice";
import { useEffect, useState } from "react";

const fieldValues = [
    '{word}',
    '{meaning}',
    '{examples}',
    'Empty'
]

type AnkiModelFildRowProps = {
    fieldName: string,
    fieldValues: string[],
    defaultValue?: string,
    onChange?: (fieldName: string, newFieldValue: string) => void;
}

function AnkiModelFildRow(props: AnkiModelFildRowProps) {
    return (
        <TableRow>
            <TableCell>
                {props.fieldName}
            </TableCell>
            <TableCell>
                <TextField
                    id={props.fieldName}
                    select
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    defaultValue={props.defaultValue}
                    onChange={(e) => { if (props.onChange) props.onChange(props.fieldName, e.target.value); }}
                >
                    {props.fieldValues.map(x => (
                        <MenuItem key={x} value={x}>
                            {x}
                        </MenuItem>
                    ))}
                </TextField>
            </TableCell>
        </TableRow>
    )
}

export default function AnkiSettings() {
    const urlInitialValue = useAppSelector(state => state.anki.url)
    const [urlValue, setUrlValue] = useState(urlInitialValue);
    const dispatch = useAppDispatch()


    const decksNames = useAppSelector(state => state.anki.decks);
    const models = useAppSelector(state => state.anki.models);
    const modelFields = useAppSelector(state => state.anki.modelFields);
    const targetModelsFields = useAppSelector(state => state.anki.targetModelFieldValues);

    const intialTargetDeck = useAppSelector(state => state.anki.targetDeck);
    const initialTargetModel = useAppSelector(state => state.anki.targetModel);

    const [targetDeckValue, setTargetDeckValue] = useState(intialTargetDeck);
    const [targetModelValue, setTargetModelValue] = useState(initialTargetModel);

    const getInitialFieldValue = (fieldName: string): string => {
        const foundField = targetModelsFields.find(x => x.fieldName == fieldName);
        if (foundField) {
            return foundField.fieldValue;
        }
        return "";
    }

    useEffect(() => {
        if (decksNames.length == 0) {
            dispatch(ankiSettingsSlice.actions.requestDecks(undefined));
        }
        if (models.length == 0) {
            dispatch(ankiSettingsSlice.actions.requestModels(undefined));
        }
        if (targetModelValue.length > 0 && modelFields.length == 0) {
            dispatch(ankiSettingsSlice.actions.requestModelFields(targetModelValue));
        }
    })


    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrlValue(e.target.value);
    }

    const handleTargetDeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetDeckValue(e.target.value);

        dispatch(ankiSettingsSlice.actions.setTargetDeck(e.target.value));
    }

    const handleTargetModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const modelName: string = e.target.value
        setTargetModelValue(modelName)
        dispatch(ankiSettingsSlice.actions.requestModelFields(modelName));
        dispatch(ankiSettingsSlice.actions.setTargetModel(modelName));
    }

    const handleFieldChange = (fieldName: string, fieldValue: string) => {
        dispatch(ankiSettingsSlice.actions.setModelFieldValue({ fieldName, fieldValue }));
    }

    return (
        <Box>
            {/* <InputLabel htmlFor="anki-url">URL</InputLabel> */}

            <TextField id="anki-url" label="URL" variant="outlined" value={urlValue} onChange={handleUrlChange} fullWidth sx={{ marginBottom: 2 }} />
            <TextField
                id="anki-target-deck"
                select
                label="Target Deck"
                helperText="Please select your target deck"
                fullWidth sx={{ marginBottom: 2 }}
                defaultValue={targetDeckValue}
                onChange={handleTargetDeckChange}
            >
                {decksNames.map(x => (
                    <MenuItem key={x} value={x}>
                        {x}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                id="anki-target-model"
                select
                label="Target model"
                helperText="Please select your target model"
                fullWidth sx={{ marginBottom: 2 }}
                defaultValue={targetModelValue}
                onChange={handleTargetModelChange}
            >
                {models.map(x => (
                    <MenuItem key={x} value={x}>
                        {x}
                    </MenuItem>
                ))}
            </TextField>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Field
                        </TableCell>
                        <TableCell>
                            Value
                        </TableCell>
                    </TableRow>
                </TableHead>

                {
                    modelFields.map(x => (<AnkiModelFildRow fieldName={x} fieldValues={fieldValues} defaultValue={getInitialFieldValue(x)} onChange={handleFieldChange} />))
                }
            </Table>
        </Box>
    )
}