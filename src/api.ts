import {AuthByApiKeyInterface} from './auth'

/**
 * Common success response
 * @see https://zulip.com/api/rest-error-handling
 */
export interface CommonSuccessResponse {
    /**
     * Human-readable error message
     */
    msg: string
    /**
     * Result code
     */
    result: 'success'
    /**
     * Ignored parameter names which the server does not support
     */
    ignored_parameters_unsupported?: string[]
}

export interface CommonErrorResponse {
    /**
     * Human-readable error message
     */
    msg: string
    /**
     * Result code
     */
    result: 'error'
    /**
     * Error code
     */
    code?: string
}

/**
 * Call API general function
 * @param authConfig Auth config
 * @param endpoint Endpoint URL based on server root
 * @param method API method
 * @param params API parameters
 * @returns API response
 */
export async function callApi<T extends CommonSuccessResponse>(
    authConfig: AuthByApiKeyInterface,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    params: { [key: string]: string | number | string[] | number[] | boolean | File } = {}
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
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false')
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
            try {
                const errorData = await response.json() as CommonErrorResponse
                throw new Error('Call API failed.', {
                    cause: errorData,
                })
            } catch {
                throw new Error('Call API failed.')
            }
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
            } else if (typeof value === 'boolean') {
                dataParams[key] = value ? 'true' : 'false'
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
                try {
                    const errorData = await response.json() as CommonErrorResponse
                    throw new Error('Call API failed.', {
                        cause: errorData,
                    })
                } catch {
                    throw new Error('Call API failed.')
                }
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
                try {
                    const errorData = await response.json() as CommonErrorResponse
                    throw new Error('Call API failed.', {
                        cause: errorData,
                    })
                } catch {
                    throw new Error('Call API failed.')
                }
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
                try {
                    const errorData = await response.json() as CommonErrorResponse
                    throw new Error('Call API failed.', {
                        cause: errorData,
                    })
                } catch {
                    throw new Error('Call API failed.')
                }
            }
            const data = await response.json() as T
            return data
        }
    }
}
