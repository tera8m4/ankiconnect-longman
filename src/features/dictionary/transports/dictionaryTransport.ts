export type DictionaryResult = {
    word: string,
    meaning: string[],
    example: string[],
}

export interface IDictionaryTransport {
    find(word: string): Promise<DictionaryResult>;
}