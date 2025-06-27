interface Options extends RequestInit {
    token?: string
    data?: object
}

const methods = ['get', 'post', 'put', 'delete'] as const

type ClientMethod = <T>(url: string, { token, ...init }: Options) => Promise<T>

type Client = {
    [method in (typeof methods)[number]]: ClientMethod
} & ClientMethod

function createMethodClient(
    baseURL: string | undefined,
    method: (typeof methods)[number],
) {
    return <T>(url: string, { token, data, body, ...init }: Options) => {
        const headers = Object.assign(
            {},
            init.headers,
            token && { Authorization: `Bearer ${token}` },
        )

        return fetch(new URL(url, baseURL), {
            ...init,
            method,
            headers,
            body: data ? JSON.stringify(data) : body,
        }).then(res => res.json()) as Promise<T>
    }
}

export function createClient(baseURL: string | undefined): Client {
    const client = createMethodClient(baseURL, 'get') as Client
    client.get = createMethodClient(baseURL, 'get')
    client.delete = createMethodClient(baseURL, 'delete')
    client.post = createMethodClient(baseURL, 'post')
    client.put = createMethodClient(baseURL, 'put')
    return client
}

const http = createClient(undefined)
