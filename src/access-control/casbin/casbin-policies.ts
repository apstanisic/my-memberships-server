/**
 * Policies for casbin
 * If this was a file it would have .csv extension
 */
export const casbinPolicies = `
p, app_owner, /*, read
p, app_owner, /*, write

p, app_admin, /companies/*, read
p, app_admin, /companies/*, write

p, owner, /companies/:id, read
p, owner, /companies/:id, write
p, owner, /companies/:id/*, read
p, owner, /companies/:id/*, write

p, admin, /companies/:id/subscription/*, read
p, admin, /companies/:id/subscription/*, write

p, user, /user/:id/subscription/*, read
`;
