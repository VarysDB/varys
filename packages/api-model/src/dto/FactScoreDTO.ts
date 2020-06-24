/**
 * ADMIN_OVERRIDE: manually edited by admin
 * USER_OVERRIDE: manually edited by user
 * GOD: highest reliability integration source (vendor API)
 * HIGH: trustworthy integration source (official website crawling, or cracked public/private vendor API)
 * MEDIUM: data provided by non-vendor source, but with reasonable reliability
 * LOW: unreliable/inaccurate data, regardless of source
 * USER_INITIAL: inital data defined by user, very likely to be overriden by any other source
 * NONE: placeholder only, needs to be overriden
 */
export enum FactScoreDTO {
    RICK_AND_MORTY = 32767,
    ADMIN_OVERRIDE = 1000,
    // 900 is reserved for MANAGER_OVERRIDE
    USER_OVERRIDE = 800,
    GOD = 700,
    HIGH = 600,
    MEDIUM = 400,
    LOW = 200,
    USER_INITIAL = 100,
    NONE = 0
}
