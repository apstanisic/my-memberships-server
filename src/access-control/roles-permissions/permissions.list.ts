/* List of all premissions */
export enum Permission {
  /* App owner */
  'add_app_admin:any' = 'add_app_admin:any',
  'remove_app_admin:any' = 'remove_app_admin:any',
  /* App admin */
  'delete_company:any' = 'delete_company:any',
  'change_company_owner:any' = 'change_company_owner:any',
  'delete_user:any' = 'delete_user:any',
  /* Company Owner */
  'update_company:own' = 'update_company:own',
  'delete_company:own' = 'delete_company:own',
  'change_company_owner:own' = 'change_company_owner:own',
  'add_company_admin:own' = 'add_company_admin:own',
  'remove_company_admin:own' = 'remove_company_admin:own',
  /* Company admin */
  'read_company_subscribers:own' = 'read_company_subscribers:own',
  'add_member_subscription:own' = 'add_member_subscription:own',
  'remove_member_subscription:own' = 'remove_member_subscription:own',
  'approve_subscription:own' = 'approve_subscription:own',
  'ban_member:own' = 'ban_member:own',
  'unban_member:own' = 'unban_member:own',
  /* User  */
  'cancel_subscription:own' = 'cancel_subscription:own',
  'request_subscription:own' = 'request_subscription:own',
  'create_company:any' = 'create_company:any'
  //   'cancel_subscription:any',
}
