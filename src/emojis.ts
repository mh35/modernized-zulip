/**
 * Emoji base
 */
export interface EmojiBase {
    /**
     * Reaction type
     */
    reaction_type: 'unicode_emoji' | 'realm_emoji' | 'zulip_extra_emoji'
    /**
     * Reaction emoji code
     */
    emoji_code?: string
    /**
     * Reaction emoji name
     */
    emoji_name: string
}
