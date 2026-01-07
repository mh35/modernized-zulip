import {AuthByApiKeyInterface} from './auth'

export async function callApi<T>(
    authConfig: AuthByApiKeyInterface,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    params: { [key: string]: string | number | string[] | number[] | File } = {}
) {
    const endpointUrl = authConfig.rootUrl + endpoint
    if (Object.values(params).some((value) => value instanceof File)) {
        // form-data
        const formData = new FormData()
        for (const key in params) {
            const value = params[key]
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value))
            } else if (value instanceof File) {
                formData.append(key, value)
            } else if (typeof value === 'number') {
                formData.append(key, value.toString())
            } else {
                formData.append(key, value)
            }
        }
        const response = await fetch(endpointUrl, {
            method: method,
            body: formData,
            headers: {
                'Authorization': 'Basic ' + btoa(authConfig.username + ':' + authConfig.apiKey)
            },
        })
        if (response.status >= 300) {
            throw new Error('Call API failed.')
        }
        const data = await response.json() as T
        return data
    } else {
        // query
        const dataParams = {} as { [key: string]: string }
        let hasValue = false
        for (const key in params) {
            hasValue = true
            const value = params[key]
            if (value instanceof File) {
                // This code must not be reached.
                throw new Error('File parameter is not supported in query parameters.')
            }
            if (Array.isArray(value)) {
                dataParams[key] = JSON.stringify(value)
            } else if (typeof value === 'number') {
                dataParams[key] = value.toString()
            } else {
                dataParams[key] = value
            }
        }
        if (!hasValue) {
            const response = await fetch(endpointUrl, {
                method: method,
                headers: {
                    'Authorization': 'Basic ' + btoa(authConfig.username + ':' + authConfig.apiKey)
                },
            })
            if (response.status >= 300) {
                throw new Error('Call API failed.')
            }
            const data = await response.json() as T
            return data
        }
        const searchParams = new URLSearchParams(dataParams)
        if (method === 'GET') {
            const response = await fetch(endpointUrl + '?' + searchParams.toString(), {
                method: method,
                headers: {
                    'Authorization': 'Basic ' + btoa(authConfig.username + ':' + authConfig.apiKey)
                },
            })
            if (response.status >= 300) {
                throw new Error('Call API failed.')
            }
            const data = await response.json() as T
            return data
        } else {
            const response = await fetch(endpointUrl, {
                method: method,
                headers: {
                    'Authorization': 'Basic ' + btoa(authConfig.username + ':' + authConfig.apiKey)
                },
                body: searchParams,
            })
            if (response.status >= 300) {
                throw new Error('Call API failed.')
            }
            const data = await response.json() as T
            return data
        }
    }
}
