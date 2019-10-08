/**
 * Policies for casbin
 * If this was a file it would have .csv extension
 */
export const casbinPolicies = `
p, app_owner, /*,  (read)|(write)

p, app_admin, /app/payment, (read)|(write)
p, app_admin, /app/payment/*, (read)|(write)

p, app_admin, /companies,  (read)|(write)
p, app_admin, /companies/*,  (read)|(write)
p, app_admin, /users,  (read)|(write)
p, app_admin, /users/*,  (read)|(write)

p, owner, /companies/:id,  (read)|(write)
p, owner, /companies/:id/*, (read)|(write)

p, admin, /companies/:id/logs, read
p, admin, /companies/:id/logs/*, read

p, admin, /companies/:id/subscriptions, (read)|(write)
p, admin, /companies/:id/subscriptions/*, (read)|(write)

p, admin, /companies/:id/locations, (read)|(write)
p, admin, /companies/:id/locations/*, (read)|(write)

p, admin, /companies/:id/roles, read
p, admin, /companies/:id/roles/*, read


p, user, /users/:id/*, read
p, user, /users/:id, read
`;
