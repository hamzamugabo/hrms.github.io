/**
 * Checks if the user has any of the specified permissions in the given group.
 * @param {Array} userPermissions - The list of user permissions.
 * @param {Array} requiredPermissions - The list of required permissions.
 * @param {string} group - The permission group to check.
 * @returns {boolean} - True if the user has any of the specified permissions in the given group, false otherwise.
 */
export function userHasPermission(userPermissions, requiredPermissions, group) {
    return userPermissions.some((permission) => requiredPermissions.includes(permission.permission) && permission.group === group);
}
