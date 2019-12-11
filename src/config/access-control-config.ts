export const casbinModel = `
[request_definition]
r = sub, dom, obj, act
[policy_definition]
p = sub, obj, act
[policy_effect]
e = some(where (p.eft == allow))
# Valid matcher
# r.sub == p.sub check if roles are the same
# if user is admin check for policies for admins
# validDomain(r.dom, r.obj) checks if provided domain is contained in object path
# validDomain('domen-id', '/domeni/domen-id') returns true;
# keyMatch2(r.obj, p.obj) checks if object path is compatible with policies path
# regexMatch(r.act, p.act) just check if user can preform action on object
# regexMatch(read, (read)|(post))
[matchers]
m = r.sub == p.sub && validDomain(r.dom, r.obj) && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act)
`;

export const policies = `
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
p, admin, /companies/:id/arrivals, (read)|(write)
p, admin, /companies/:id/arrivals/*, (read)|(write)
p, admin, /companies/:id/roles, read
p, admin, /companies/:id/roles/*, read
p, user, /users/:id/*, read
p, user, /users/:id, read
`;

export const allRoles = ['admin', 'owner', 'user', 'app_admin', 'app_owner'];
