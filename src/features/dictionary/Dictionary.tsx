import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react"
import { DictionaryResult, IDictionaryTransport } from "./transports/dictionaryTransport";
import { LongmanDictionaryTransport } from "./transports/longmanTransport";
import VocabularyCard from "./VocabularyCard";

type DictionaryPropsType = {
    word: string
}

enum DictionaryState {
    Empty,
    Loading,
    Finished,
    Failed
}

const dictionaryTransport: IDictionaryTransport = LongmanDictionaryTransport.getSingleton();
const emptyDictionary: DictionaryResult = {
    word: '',
    example: [],
    meaning: [],
};

export function Dictionary(prop: DictionaryPropsType) {
    const [loadingState, setLoadingState] = useState(DictionaryState.Empty);
    const [dicitonaryResult, setDicitonaryResult] = useState(emptyDictionary);

    useEffect(() => {
        if (prop.word.length === 0) {
            setLoadingState(DictionaryState.Empty);
            return;
        }

        setLoadingState(DictionaryState.Loading);

        dictionaryTransport.find(prop.word)
            .then(x => {
                setDicitonaryResult(x);
                setLoadingState(DictionaryState.Finished);
            })
            .catch(reason => {
                setLoadingState(DictionaryState.Failed);
            })
    }, [prop.word]);

    switch (loadingState) {
        case DictionaryState.Empty:
            return (<div></div>);
        case DictionaryState.Loading:
            return (<CircularProgress />);
        case DictionaryState.Finished:
            return (<VocabularyCard {...dicitonaryResult} />);
        case DictionaryState.Failed:
        default:
            return (<div>Failed to load</div>);
    }

}