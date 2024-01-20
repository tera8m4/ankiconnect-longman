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
