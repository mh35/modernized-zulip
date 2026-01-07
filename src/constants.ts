// Role values
/**
 * Organization owner role number
 * @see https://zulip.com/api/roles-and-permissions
 */
export const ORG_OWNER_ROLE = 100
/**
 * Organization administrator role number
 * @see https://zulip.com/api/roles-and-permissions
 */
export const ORG_ADMIN_ROLE = 200
/**
 * Organization moderator role number
 * @see https://zulip.com/api/roles-and-permissions
 */
export const ORG_MODERATOR_ROLE = 300
/**
 * Member role number
 * @see https://zulip.com/api/roles-and-permissions
 */
export const MEMBER_ROLE = 400
/**
 * Guest role number
 * @see https://zulip.com/api/roles-and-permissions
 */
export const GUEST_ROLE = 600

/**
 * Role numbers
 * @see https://zulip.com/api/roles-and-permissions
 */
export type ROLE_NUMS = 100 | 200 | 300 | 400 | 600

// Visibility values
/**
 * No policies.
 * @see https://zulip.com/api/update-user-topic#parameter-visibility_policy
 */
export const NO_VISIBILITY_POLICY = 0
/**
 * Muted policy.
 * @see https://zulip.com/api/update-user-topic#parameter-visibility_policy
 */
export const MUTED_VISIBILITY_POLICY = 1
/**
 * Unmuted policy.
 * @see https://zulip.com/api/update-user-topic#parameter-visibility_policy
 */
export const UNMUTED_VISIBILITY_POLICY = 2
/**
 * Followed policy.
 * @see https://zulip.com/api/update-user-topic#parameter-visibility_policy
 */
export const FOLLOWED_VISIBILITY_POLICY = 3

/**
 * Policy values
 * @see https://zulip.com/api/update-user-topic#parameter-visibility_policy
 */
export type VISIBILITY_POLICY_NUMS = 0 | 1 | 2 | 3
