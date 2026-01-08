export interface AuthBaseInterface {
    /**
     * Zulip root URL. This does not end with /
     */
    rootUrl: string
    /**
     * Zulip username or email address
     */
    username: string
}

export interface AuthByPasswordInterface extends AuthBaseInterface {
    /**
     * Zulip password
     */
    password: string
}

export interface AuthByApiKeyInterface extends AuthBaseInterface {
    /**
     * Zulip API key
     */
    apiKey: string
}

export interface AuthDevInterface extends AuthBaseInterface {
    /**
     * Development flag
     */
    development: true
}

export interface AuthByJwtTokenInterface {
    /**
     * Zulip root URL. This does not end with /
     */
    rootUrl: string
    /**
     * JWT token to authenticate. This must contain email field.
     */
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
