import { useEffect } from "react";
import { ankiSettingsSlice } from "./ankiConnectSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export function AnkiConnectionIndicator() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log('hello');
        dispatch(ankiSettingsSlice.actions.connectAsync(undefined));
    }, [])

    const status = useAppSelector(ankiSettingsSlice.selectors.selectAnkiStatus)


    if (status == "connected") {
        return (
            <div>AnkiConnect:🟢</div>
        )
    }
    else if (status == "disconnected") {
        return (<div>AnkiConnect:❌</div>);
    }
    else if (status == "loading") {
        return (<div>AnkiConnect:⌚</div>);
    }

}