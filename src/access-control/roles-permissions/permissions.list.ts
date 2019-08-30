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
// const paths = [
//   '/company/comp_id/subscriptions/sub_id',
//   '/user/user_id/subs/sub_id'
// ];
/**
 * /* read, write    ---- app_owner
 *
 * /company/* read, write  ---- app_admin
 * /user/* read, write
 * /company/comp_id/subscriptions
 *                 /admin
 * /company/comp_id/owner
 * /company/comp_id/* read, write   --- owner_comp_id
 *
 * /company/comp_id/* read    ---- admin_comp_id
 * /company/comp_id/subs/* read, write
 *
 * // company/comp_id/info read, write
 * /user/user_id/* read
 * /user/user_id/subs/
 * /company/subscription read, write
 * /company/member read, write
 *
 *
p, admin, gym-id, /gym/gym-id/*
p, app_admin, *, /gym/*
p, app_admin, *, /user/*
p, app_admin, *, /user/owner_id deny
 *
 *
 */
