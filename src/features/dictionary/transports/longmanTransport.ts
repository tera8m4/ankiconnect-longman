import domify from "../../../utils/domify";
import { Dictionary } from "../Dictionary";
import { DictionaryResult, IDictionaryTransport } from "./dictionaryTransport";

export class LongmanDictionaryTransport implements IDictionaryTransport {
    private readonly CORS_PROXY: string = `https://murmuring-tor-18986.fly.dev`;
    private readonly DICIONARY_URL: string = `https://www.ldoceonline.com/dictionary`;
    private readonly WORD_QUERY: string = `.entry_content h1.pagetitle`;
    private readonly DEFINITION_QUERY: string = `.Sense .DEF`;
    private readonly EXAMPLE_QUERY: string = `.Sense .EXAMPLE`;

    private static instance: IDictionaryTransport | undefined;

    private isRunning: boolean = false;

    public static getSingleton(): IDictionaryTransport {
        if (this.instance == undefined) {
            this.instance = new LongmanDictionaryTransport();
        }
        return this.instance;
    }

    private constructor() { }

    public async find(word: string): Promise<DictionaryResult> {
        if (this.isRunning) {
            return Promise.reject("has running request");
        }

        this.isRunning = true;

        return fetch(this.getQuery(word))
            .then(resp => {
                if (!resp.ok) {
                    return Promise.reject();
                }
                return resp.text();
            })
            .then(x => {
                const result = this.createDictionaryResult(x);

                this.isRunning = false;
                if (result) {
                    return result;
                }
                return Promise.reject("Failed to parse the page");
            });
    }

    private getQuery(word: string) {
        const escapedWord: string = word
            .toLowerCase()
            .replace(/[(!?.,)]/g, '')
            .trim()
            .replace(/[/ ’]/g, '-');

        return `${this.DICIONARY_URL}/${escapedWord}`;
        // return `${this.CORS_PROXY}/${this.DICIONARY_URL}/${escapedWord}`;
    }

    private createDictionaryResult(pageMarkup: string): DictionaryResult | undefined {
        const domObj = domify(pageMarkup);

        const word = this.findWord(domObj);
        if (word === undefined) {
            return undefined;
        }

        const meaning = this.findMeaning(domObj);
        if (meaning.length == 0) {
            return undefined;
        }

        const example = this.findExample(domObj);

        return { word, meaning, example }
    }

    private findWord(dom: HTMLElement): string | undefined {
        return dom.querySelector(this.WORD_QUERY)?.textContent?.trim();
    }

    private findMeaning(dom: HTMLElement): string[] {
        return Array.from(dom.querySelectorAll(this.DEFINITION_QUERY)).map((x => (x as HTMLSpanElement).innerText.trim()));
    }

    private findExample(dom: HTMLElement): string[] {
        return Array.from(dom.querySelectorAll(this.EXAMPLE_QUERY)).map((x => (x as HTMLSpanElement).innerText.trim()));
    }
}