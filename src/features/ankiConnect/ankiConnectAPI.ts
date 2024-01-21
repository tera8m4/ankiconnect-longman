import { AnkiSettingsState } from "./ankiConnectSlice";

export async function ankiConnectTest(url: string): Promise<void> {
    return fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "action": "deckNames",
            "version": 6
        }),
    }).then(resp => {
        if (!resp.ok) {
            return Promise.reject();
        }
    });
}

export async function ankiRequestDecks(url: string): Promise<string[]> {
    return fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "action": "deckNames",
            "version": 6
        }),
    }).then(resp => {
        if (!resp.ok) {
            return Promise.reject();
        }
        return resp.json();
    }).then(x => x["result"]);
}

export async function ankiRequestModels(url: string): Promise<string[]> {
    return fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "action": "modelNames",
            "version": 6
        }),
    }).then(resp => {
        if (!resp.ok) {
            return Promise.reject();
        }
        return resp.json();
    }).then(x => x["result"]);
}

export async function ankiRequestModelFields(url: string, modelName: string): Promise<string[]> {
    return fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "action": "modelFieldNames",
            "version": 6,
            "params": {
                modelName,
            },
        }),
    }).then(resp => {
        if (!resp.ok) {
            return Promise.reject();
        }
        return resp.json();
    }).then(x => x["result"]);
}


export type AddNoteData = {
    word: string,
    meaning: string[],
    example: string[],
    tag: string,
};

function getFieldData(anki: AnkiSettingsState, data: AddNoteData): { [key: string]: string } {
    const obj: { [key: string]: string } = {};

    const maxExamplesAmount: number = 3;

    const joinedMeanings = data.meaning.map(x => `<li>${x}</li>`).join("");
    const meanings: string = `<ol>${joinedMeanings}</ol>`;

    const joinedExamples: string = data.meaning.slice(0, maxExamplesAmount).map(x => `<li>${x}</li>`).join("");
    const examples: string = `<ol>${joinedExamples}</ol>`;

    const getValue = (x: string): string => {
        if (x === "{example}") {
            return examples;
        } else if (x === "{meaning}") {
            return meanings;
        } else if (x === "{word}") {
            return data.word;
        }
        return "";
    }


    anki.targetModelFieldValues.forEach(x => {
        obj[x.fieldName] = getValue(x.fieldValue);
    });

    return obj;
}

export async function ankiRequestAddNote(anki: AnkiSettingsState, data: AddNoteData): Promise<void> {
    const fieldsData = getFieldData(anki, data);

    return fetch(anki.url, {
        method: 'POST',
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "action": "addNote",
            "version": 6,
            "params": {
                "note": {
                    "deckName": anki.targetDeck,
                    "modelName": anki.targetModel,
                    "fields": fieldsData,

                    "options": {
                        "allowDuplicate": false,
                        "duplicateScope": "deck",
                        "duplicateScopeOptions": {
                            "deckName": "Default",
                            "checkChildren": false,
                            "checkAllModels": false
                        }
                    },

                    "tags": [
                        data.tag,
                    ],
                },
            },
        })
    }).then(resp => {
        if (!resp.ok) {
            return Promise.reject("Failed to add a note");
        }
    });
}
