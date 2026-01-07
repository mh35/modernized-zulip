import { callApi, CommonSuccessResponse } from './api'
import { AuthByApiKeyInterface } from './auth'
import { VISIBILITY_POLICY_NUMS } from './constants'
import { EmojiBase } from './emojis'

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
 * Narrow object item base
 */
export type NarrowItemObjBase = {
    /**
     * Narrow operator
     */
    operator: string
    /**
     * Narrow operand
     */
    operand: string | number | number[]
    /**
     * Negate narrow or not
     */
    negated?: boolean
}

/**
 * Narrow item object with ID operand
 * @see https://github.com/zulip/zulip/blob/main/zerver/lib/narrow.py#L118
 */
export type NarrowItemObjWithId = NarrowItemObjBase & {
    /**
     * Narrow operator
     */
    operator: 'channel' | 'stream' | 'id' | 'sender' | 'group-pm-with' |
        'dm-including' | 'mentions' | 'with'
    /**
     * Narrow operand
     */
    operand: string | number
}

/**
 * Narrow item object with IDs operand
 * @see https://github.com/zulip/zulip/blob/main/zerver/lib/narrow.py#L127
 */
export type NarrowItemObjWithIds = NarrowItemObjBase & {
    /**
     * Narrow operator
     */
    operator: 'pm-with' | 'dm'
    /**
     * Narrow operand
     */
    operand: string | number[]
}

/**
 * Narrow item object with non-empty string operand
 * @see https://github.com/zulip/zulip/blob/main/zerver/lib/narrow.py#L128
 */
export type NarrowItemObjWithNonEmptyStr = NarrowItemObjBase & {
    /**
     * Narrow operator
     */
    operator: 'search'
    /**
     * Narrow operand
     */
    operand: Exclude<string, ''>
}

/**
 * Narrow item object other than them
 */
export type NarrowItemObjNonSpecificated = NarrowItemObjBase & {
    /**
     * Narrow operator
     */
    operator: Exclude<
        string,
        'channel' | 'stream' | 'id' | 'sender' | 'group-pm-with' | 'dm-including' | 'mentions' |
        'with' | 'pm-with' | 'dm' | 'search'
    >
    /**
     * Narrow operand
     */
    operand: string
}

/**
 * Narrow item object
 */
export type NarrowItemObj = NarrowItemObjWithId | NarrowItemObjWithIds |
    NarrowItemObjWithNonEmptyStr | NarrowItemObjNonSpecificated

/**
 * Get messages API parameters base
 */
export type GetMessagesParamsBase = {
    /**
     * Whether to get client graveter. Default is false
     */
    client_gravatar?: boolean
    /**
     * Whether to apply markdown. Default is true
     */
    apply_markdown?: boolean
    /**
     * Narrow to filter messages
     */
    narrow?: (NarrowItemObj | string[])[]
    /**
     * Allow empty topic name or not
     */
    allow_empty_topic_name?: boolean
}

/**
 * Get messages API parameters without message IDs
 */
export type GetMessagesParamsWithoutIds = GetMessagesParamsBase & {
    /**
     * Message anchor
     */
    anchor: number | 'newest' | 'oldest' | 'first_unread'
    /**
     * Whether include anchor messages or not. Default is true
     */
    include_anchor?: boolean
    /**
     * Messages to retrieve before anchor.
     */
    num_before: number
    /**
     * Messages to retrieve after anchor.
     */
    num_after: number
    message_ids: never
    /**
     * Use first unread anchor
     * @deprecated Use anchor: 'first_unread' instead
     */
    use_first_unread_anchor?: boolean
}

/**
 * Get messages API parameters with message IDs
 */
export type GetMessagesParamsWithIds = GetMessagesParamsBase & {
    anchor: never
    include_anchor: never
    num_before: never
    num_after: never
    /**
     * Message IDs
     */
    message_ids: number[]
    use_first_unread_anchor: never
}

/**
 * Get messages API parameters
 */
export type GetMessagesParams = GetMessagesParamsWithoutIds | GetMessagesParamsWithIds

/**
 * Message display recipient
 */
export interface DisplayRecipientItem {
    /**
     * User ID
     */
    id: number
    /**
     * User email
     */
    email: string
    /**
     * User full name
     */
    full_name: string
    /**
     * Whether the user is a mirror dummy
     */
    is_mirror_dummy: boolean
}

/**
 * Message edit history item
 */
export interface EditHistoryItem {
    /**
     * Previous content
     */
    prev_content?: string
    /**
     * Previous rendered content
     */
    prev_rendered_content?: string
    /**
     * Previous stream ID
     */
    prev_stream?: number
    /**
     * Previous topic
     */
    prev_topic?: string
    /**
     * New stream ID
     */
    stream?: number
    /**
     * Edit timestamp from the Epoch
     */
    timestamp: number
    /**
     * New topic
     */
    topic?: string
    /**
     * Editor user ID
     */
    user_id: number | null
}

/**
 * Emoji reaction item
 */
export interface EmojiReactionItem extends EmojiBase {
    /**
     * Reaction user ID
     */
    user_id: number
}

/**
 * Submessage item
 */
export interface SubmessageItem {
    /**
     * Message type
     */
    msg_type: string
    /**
     * Message content
     */
    content: string
    /**
     * Message ID
     */
    message_id: number
    /**
     * Sender user ID
     */
    sender_id: number
    /**
     * Submessage ID
     */
    id: number
}

/**
 * Message topic link item
 */
export interface TopicLinkItem {
    /**
     * Topic link text
     */
    text: string
    /**
     * Topic link URL
     */
    url: string
}

/**
 * Message flags
 */
export type MessageFlagValues = 'read' | 'starred' | 'collapsed' | 'mentioned' |
    'stream_wildcard_mentioned' | 'topic_wildcard_mentioned' | 'has_alert_word' |
    'historical' | 'wildcard_mentioned'

/**
 * Messages base
 */
export type MessagesBase = {
    /**
     * Avatar URL
     */
    avatar_url?: string | null
    /**
     * Client name
     */
    client?: string
    /**
     * Message content
     */
    content?: string
    /**
     * Content type
     */
    content_type?: string
    /**
     * Display recipient
     */
    display_recipient?: string | DisplayRecipientItem[]
    /**
     * Edit history
     */
    edit_history?: EditHistoryItem[]
    /**
     * Message ID
     */
    id?: number
    /**
     * Whether the message is sent by current user
     */
    is_me_message?: boolean
    /**
     * Last edit timestamp from the Epoch
     */
    last_edit_timestamp?: number
    /**
     * Last moved timestamp from the Epoch
     */
    last_moved_timestamp?: number
    /**
     * Reactions to the message
     */
    reactions?: EmojiReactionItem[]
    /**
     * Recipient ID
     */
    recipient_id?: number
    /**
     * Sender email address
     */
    sender_email?: string
    /**
     * Sender full name
     */
    sender_full_name?: string
    /**
     * Sender ID
     */
    sender_id?: number
    /**
     * Sender realm
     */
    sender_realm_str?: string
    /**
     * Stream ID
     */
    stream_id?: number
    /**
     * Topic name
     */
    subject?: string
    /**
     * Submessages
     */
    submessages?: SubmessageItem[]
    /**
     * Timestamp from the Epoch
     */
    timestamp?: number
    /**
     * Topic links
     */
    topic_links?: TopicLinkItem[]
    /**
     * Message type
     */
    type?: 'stream' | 'private'
}

/**
 * Get messages API message item
 */
export type GetMessagesMessage = MessagesBase & {
    /**
     * Avatar URL
     */
    avatar_url: string | null
    /**
     * Message content
     */
    content: string
    /**
     * Content type
     */
    content_type: string
    /**
     * Display recipient
     */
    display_recipient: string | DisplayRecipientItem[]
    /**
     * Message ID
     */
    id: number
    /**
     * Whether the message is sent by current user
     */
    is_me_message: boolean
    /**
     * Reactions to the message
     */
    reactions: EmojiReactionItem[]
    /**
     * Recipient ID
     */
    recipient_id: number
    /**
     * Sender email address
     */
    sender_email: string
    /**
     * Sender full name
     */
    sender_full_name: string
    /**
     * Sender ID
     */
    sender_id: number
    /**
     * Sender realm
     */
    sender_realm_str: string
    /**
     * Topic name. Empty string if type=private
     */
    subject: string
    /**
     * Submessages
     */
    submessages: SubmessageItem[]
    /**
     * Timestamp from the Epoch
     */
    timestamp: number
    /**
     * Topic links
     */
    topic_links: TopicLinkItem[]
    /**
     * Message type
     */
    type: 'stream' | 'private'
    /**
     * Message flags
     */
    flags: MessageFlagValues[]
    /**
     * Matched content hilighted string. Only present if narrow contains search keywords
     */
    match_content?: string
    /**
     * Matched subject hilighted string. Only present if narrow contains search keywords
     */
    match_subject?: string
}

/**
 * Get messages API response
 */
export interface GetMessagesResponse extends CommonSuccessResponse {
    anchor?: number
    found_newest?: boolean
    found_oldest?: boolean
    found_anchor?: boolean
    history_limited?: boolean
    messages: GetMessagesMessage[]
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

/**
 * Get messages
 * @param authConfig Auth config
 * @param params Get messages parameters
 * @returns The result of get messages
 * @see https://zulip.com/api/get-messages
 */
export async function getMessages(authConfig: AuthByApiKeyInterface, params: GetMessagesParams) {
    const data = 'narrow' in params ? {
        ...params,
        narrow: JSON.stringify(params.narrow)
    } : params as unknown as { [key: string]: string | number | string[] | number[] | boolean }
    const resp = await callApi<GetMessagesResponse>(
        authConfig,
        '/api/v1/messages',
        'GET',
        data
    )
    return resp
}
