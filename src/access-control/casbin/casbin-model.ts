import { newModel } from 'casbin';

/**
 * Configuration for model
 * If this is file it would have .conf extension
 */
const modelConf = `
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
# r.act == p.act just check if user can preform action on object
[matchers]
m = r.sub == p.sub && validDomain(r.dom, r.obj) && keyMatch2(r.obj, p.obj) && r.act == p.act
`;

const casbinModel = newModel();
casbinModel.loadModelFromText(modelConf);
export { casbinModel };
