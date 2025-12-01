export interface AuthBaseInterface {
    rootUrl: string
    username: string
}

export interface AuthByPasswordInterface extends AuthBaseInterface {
    password: string
}

export interface AuthByApiKeyInterface extends AuthBaseInterface {
    apiKey: string
}

export interface AuthDevInterface extends AuthBaseInterface {
    development: true
}

export interface AuthByJwtTokenInterface {
    rootUrl: string
    jwtToken: string
}

export type AuthInterface = AuthByPasswordInterface | AuthByApiKeyInterface |
    AuthDevInterface | AuthByJwtTokenInterface

/**
 * Authenticate with Zulip API.
 * @param authInfo Authenticate information
 * @returns API access information containing root URL, login username, and API key.
 */
export async function authenticate(authInfo: AuthInterface) {
    if ('password' in authInfo) {
        const endpoint = authInfo.rootUrl + '/api/v1/fetch_api_key'
        const response = await fetch(endpoint, {
            method: 'POST',
            body: new URLSearchParams({
                username: authInfo.username,
                password: authInfo.password
            })
        })
        if (response.status >= 300) {
            throw new Error('User authentication failed.')
        }
        const data = await response.json() as {
            api_key: string
            email: string
            user_id?: number
        }
        return {
            rootUrl: authInfo.rootUrl,
            username: authInfo.username,
            apiKey: data.api_key
        }
    } else if ('apiKey' in authInfo) {
        return authInfo
    } else if ('development' in authInfo && authInfo.development) {
        const endpoint = authInfo.rootUrl + '/api/v1/dev_fetch_api_key'
        const response = await fetch(endpoint, {
            method: 'POST',
            body: new URLSearchParams({
                username: authInfo.username,
            })
        })
        if (response.status >= 300) {
            throw new Error('User authentication failed.')
        }
        const data = await response.json() as {
            api_key: string
            email: string
            user_id?: number
        }
        return {
            rootUrl: authInfo.rootUrl,
            username: authInfo.username,
            apiKey: data.api_key
        }
    } else if ('jwtToken' in authInfo) {
        const endpoint = authInfo.rootUrl + '/api/v1/jwt/fetch_api_key'
        const response = await fetch(endpoint, {
            method: 'POST',
            body: new URLSearchParams({
                token: authInfo.jwtToken
            })
        })
        if (response.status >= 300) {
            throw new Error('User authentication failed.')
        }
        const data = await response.json() as {
            api_key: string
            email: string
        }
        return {
            rootUrl: authInfo.rootUrl,
            username: data.email,
            apiKey: data.api_key
        }
    } else {
        throw new Error('Unsupported authentication method.')
    }
}

