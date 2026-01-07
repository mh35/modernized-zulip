import { callApi, CommonSuccessResponse } from './api'
import { AuthByApiKeyInterface } from './auth'
import { VISIBILITY_POLICY_NUMS } from './constants'

/**
 * Send a message API common parameters
 */
export type SendMessageCommonParams = {
    /**
     * Target stream name, user ID, stream ID, user email, or list of them.
     */
    to: string | number | string[] | number[]
    /**
     * Message content
     */
    content: string
    /**
     * Mark as read by sender or not. If not specified, the server heuristic value.
     */
    read_by_sender?: boolean
}

/**
 * Send a message API direct message parameters.
 */
export type SendDirectMessageParams = SendMessageCommonParams & {
    /**
     * Message type.
     */
    type: 'direct'
}

/**
 * Send a message API stream message parameters.
 */
export type SendStreamMessageParams = SendMessageCommonParams & {
    /**
     * Message type.
     */
    type: 'stream' | 'channel'
}

/**
 * Send a message API specifies queue parameters.
 */
export type WithQueueMessageParams = {
    /**
     * Queue ID.
     */
    queue_id: string
    /**
     * Local echo ID.
     */
    local_id: string
}

/**
 * Send a message API does not specify queue parameters.
 */
export type WithoutQueueMessageParams = {
    /**
     * Queue ID.
     */
    queue_id: never
    /**
     * Local echo ID.
     */
    local_id: never
}

/**
 * Send a message API parameters.
 */
export type SendMessageParams = (
    SendDirectMessageParams | SendStreamMessageParams
) & (WithQueueMessageParams | WithoutQueueMessageParams)

/**
 * Send a message API response.
 */
export interface SendMessageResponse extends CommonSuccessResponse {
    id: number
    automatic_new_visibility_policy?: VISIBILITY_POLICY_NUMS
}

/**
 * Upload a file API parameters.
 */
export type UploadFileParams = {
    /**
     * Upload file
     */
    filename: File
}

/**
 * Upload a file API response.
 */
export interface UploadFileResponse extends CommonSuccessResponse {
    /**
     * Upload file URI
     * @deprecated Use url field instead.
     */
    uri: string
    /**
     * Upload file URL
     */
    url: string
    /**
     * Upload filename
     */
    filename: string
}

/**
 * Edit a message API common parameters
 */
export type EditMessageCommonParams = {
    /**
     * Message ID
     */
    message_id: number
}

/**
 * Edit a message API parameters only editing message content
 */
export type EditMessageOnlyMessageParams = EditMessageCommonParams & {
    topic: never
    /**
     * Propagation mode. If only editing message content,
     * change_one is only valid parameter.
     */
    propagate_mode?: 'change_one'
    send_notification_to_old_thread: never
    send_notification_to_new_thread: never
    /**
     * Message content
     */
    content: string
    /**
     * SHA256 sum of previous content
     */
    prev_content_sha256?: string
    stream_id: never
}

/**
 * Edit a message API base parameters.
 */
export type EditMessageBaseParams = EditMessageCommonParams & {
    /**
     * Propagation mode.
     */
    propagate_mode? : 'change_later' | 'change_one' | 'change_all'
}

/**
 * Edit a message API change topic name parameters.
 */
export type EditMessageChangeTopicParams = {
    /**
     * New topic name
     */
    topic: string
}

/**
 * Edit a message API change send notification to old thread parameters.
 */
export type EditMessageChangeSendNotificationToOldThreadParams = {
    /**
     * Send notification to old thread flag
     */
    send_notification_to_old_thread: boolean
}

export type EditMessageChangeSendNotificationToNewThreadParams = {
    send_notification_to_new_thread: boolean
}

/**
 * Edit a message API change send notification to new thread parameters.
 */
export type EditMessageChangeStreamParams = {
    stream_id: number
}

/**
 * Edit a message API not only editing message content
 */
export type EditMessageNotOnlyMessageParams = EditMessageBaseParams & (
    EditMessageChangeTopicParams |
    EditMessageChangeSendNotificationToOldThreadParams |
    EditMessageChangeSendNotificationToNewThreadParams |
    EditMessageChangeStreamParams
) & {
    /**
     * Message content
     */
    content?: string
    /**
     * SHA256 sum of previous content
     */
    prev_content_sha256?: string
}

/**
 * Edit a message parameters
 */
export type EditMessageParams = EditMessageOnlyMessageParams | EditMessageNotOnlyMessageParams

/**
 * Message item in deteched uploads in response of edit a message API.
 */
export interface EditMessageDetachedUploadMessageItem {
    /**
     * Milliseconds from the Epoch when the message was sent.
     */
    date_sent: number
    /**
     * Message ID
     */
    id: number
}

/**
 * Detached upload item in response of edit a message API.
 */
export interface EditMessageDetachedUploadItem {
    /**
     * The unique attachment ID
     */
    id: number
    /**
     * The name of uploaded file
     */
    name: string
    /**
     * A representation of the path of the file within the repository of user-uploaded files.
     */
    path_id: string
    /**
     * File size in bytes.
     */
    size: number
    /**
     * Milliseconds from the Epoch when the file is uploaded
     */
    create_time: number
    /**
     * Basic message information which attaches this file.
     */
    messages: EditMessageDetachedUploadMessageItem[]
}

/**
 * Edit a message API resonse.
 */
export interface EditMessageResponse extends CommonSuccessResponse {
    /**
     * Detached upload files.
     */
    detached_uploads: EditMessageDetachedUploadItem[]
}

/**
 * Delete a message API parameters.
 */
export type DeleteMessageParams = {
    /**
     * Message ID
     */
    message_id: number
}

/**
 * Send a message.
 * @param authConfig Auth config
 * @param params Send a message parameters
 * @returns The result of sending a message.
 * @see https://zulip.com/api/send-message
 */
export async function sendAMessage(authConfig: AuthByApiKeyInterface, params: SendMessageParams) {
    const resp = await callApi<SendMessageResponse>(
        authConfig,
        '/api/v1/messages',
        'POST',
        params
    )
    return resp
}

/**
 * Upload a file
 * @param authConfig Auth config
 * @param params Upload a file parameters
 * @returns The result of uploading a file.
 * @see https://zulip.com/api/upload-file
 */
export async function uploadAFile(authConfig: AuthByApiKeyInterface, params: UploadFileParams) {
    const resp = await callApi<UploadFileResponse>(
        authConfig,
        '/api/v1/messages',
        'POST',
        params
    )
    return resp
}

/**
 * Edit a message
 * @param authConfig Auth config
 * @param params Edit a message parameters
 * @returns The result of editing a message
 * @see https://zulip.com/api/update-message
 */
export async function editAMessage(authConfig: AuthByApiKeyInterface, params: EditMessageParams) {
    const endpointUrl = `/api/v1/messages/${params.message_id}`
    const data = {...params} as { [key: string]: string | number | string[] | number[] | boolean}
    delete data.message_id
    const resp = await callApi<EditMessageResponse>(
        authConfig,
        endpointUrl,
        'PATCH',
        data
    )
    return resp
}

/**
 * Delete a message
 * @param authConfig Auth config
 * @param params Delete a message parameters
 * @returns The result of deleting a message
 * @see https://zulip.com/api/delete-message
 */
export async function deleteAMessage(authConfig: AuthByApiKeyInterface, params: DeleteMessageParams) {
    const endpointUrl = `/api/v1/messages/${params.message_id}`
    const resp = await callApi<CommonSuccessResponse>(
        authConfig,
        endpointUrl,
        'DELETE'
    )
    return resp
}
