/** This is custom matcher for Casbin. It checks if provided domain is valid */
export function casbinValidDomain(domain: string, resourcePath: string) {
  if (domain === '*') return true;
  return resourcePath.includes(domain);
}
