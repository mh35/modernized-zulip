export interface SendMessageParameters {
    type: 'direct' | 'channel' | 'stream' | 'private'
    to: string | number | string[] | number[]
    content: string
    topic?: string
    queue_id?: string
    local_id?: string
    read_by_sender?: boolean
}