import { PayloadAction, isAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice"
import { RootState } from "../../app/store";
import { ankiConnectTest, ankiRequestDecks, ankiRequestModelFields, ankiRequestModels } from "./ankiConnectAPI";

export type AnkiModelFieldValue = {
    fieldName: string,
    fieldValue: string,
};

export type AnkiSettingsState = {
    url: string,
    status: "connected" | "disconnected" | "loading",
    decks: string[],
    targetDeck: string,
    models: string[],
    targetModel: string,
    modelFields: string[],
    targetModelFieldValues: AnkiModelFieldValue[],
}

const initialState: AnkiSettingsState = {
    url: "http://localhost:8765",
    status: "disconnected",
    decks: [],
    targetDeck: "",
    models: [],
    targetModel: "",
    modelFields: [],
    targetModelFieldValues: [],
}

const localStorageData = localStorage.getItem('anki');
if (localStorageData) {
    Object.assign(initialState, JSON.parse(localStorageData));
}

export const ankiSettingsSlice = createAppSlice({
    name: "anki",
    initialState,
    reducers: create => ({
        setTargetDeck: create.reducer(
            (state, action: PayloadAction<string>) => {
                state.targetDeck = action.payload;
            }
        ),

        setTargetModel: create.reducer(
            (state, action: PayloadAction<string>) => {
                state.targetModel = action.payload;
            }
        ),

        setModelFieldValue: create.reducer(
            (state, action: PayloadAction<AnkiModelFieldValue>) => {
                const foundField = state.targetModelFieldValues.find(x => x.fieldName == action.payload.fieldName);
                if (foundField) {
                    foundField.fieldName = action.payload.fieldValue;
                } else {
                    state.targetModelFieldValues.push(action.payload);
                }
            },
        ),

        connectAsync: create.asyncThunk(
            async (_: unknown, thunkAPI) => {
                const state = thunkAPI.getState() as RootState;
                const response = await ankiConnectTest(state.anki.url);
                return response;
            },
            {
                pending: state => {
                    state.status = "loading";
                },
                fulfilled: state => {
                    state.status = "connected";
                },
                rejected: state => {
                    state.status = "disconnected";
                },
            },
        ),

        requestDecks: create.asyncThunk(
            async (_: unknown, thunkAPI) => {
                const state = thunkAPI.getState() as RootState;
                const response = await ankiRequestDecks(state.anki.url);
                return response;
            },
            {
                fulfilled: (state, action: PayloadAction<string[]>) => {
                    state.decks = action.payload;
                },
                rejected: state => {
                    state.status = "disconnected";
                }
            }
        ),

        requestModels: create.asyncThunk(
            async (_: unknown, thunkAPI) => {
                const state = thunkAPI.getState() as RootState;
                const response = await ankiRequestModels(state.anki.url);
                return response;
            },
            {
                fulfilled: (state, action: PayloadAction<string[]>) => {
                    state.models = action.payload;
                },
                rejected: state => {
                    state.status = "disconnected";
                }
            }
        ),

        requestModelFields: create.asyncThunk(
            async (modelName: string, thunkAPI) => {
                const state = thunkAPI.getState() as RootState;
                const response = await ankiRequestModelFields(state.anki.url, modelName);
                return response;
            },
            {
                fulfilled: (state, action: PayloadAction<string[]>) => {
                    state.modelFields = action.payload;
                },
                rejected: state => {
                    state.status = "disconnected";
                }
            }
        )
    }),
    selectors: {
        selectAnkiStatus: anki => anki.status,
    },

});