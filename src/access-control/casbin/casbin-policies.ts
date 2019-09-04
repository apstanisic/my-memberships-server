/**
 * Policies for casbin
 * If this was a file it would have .csv extension
 */
export const casbinPolicies = `
p, app_owner, /*, read
p, app_owner, /*, write

p, app_admin, /company/*, read
p, app_admin, /company/*, write

p, owner, /company/:id/*, read
p, owner, /company/:id/*, write

p, admin, /company/:id/subscription/*, read
p, admin, /company/:id/subscription/*, write

p, user, /user/:id/subscription/*, read
`;
