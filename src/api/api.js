import { getAction,deleteAction,putAction,postAction} from './manage'

export const api_uaa = {
  /**
   * 默认的处理验证码的url前缀
   */
  DEFAULT_VALIDATE_CODE_URL_PREFIX: '/api/oauth-center/validate/random-code',
  /**
   * 手机号的处理验证码的url前缀
   */
  MOBILE_VALIDATE_CODE_URL_PREFIX: '/api/oauth-center/validate/sms-code',
  /**
   * 默认请求 TOKEN 登陆地址
   */
  OAUTH_TOKEN_URL: '/api/oauth-center/oauth/token',
  /**
   * 登出URL
   */
  LOGOUT_URL: '/api/oauth-center/oauth/remove/token',
}

export const api_platf = {
  /**
   * 用户详情
   */
  USER_BY_NAME_URL: '/api/admin-platform/platform/user/getByUsername',

  /**
   * 用户详情
   */
  USER_BY_PHONE_URL: '/api/admin-platform/platform/user/getByPhone',
  /**
   * 平台登陆用户 角色身份
   */
  ROLE_URL: '/api/admin-platform/platform/role/info',

  /**
   * 平台登陆用户 拥有权限
   */
  PERMISSION_URL: '/api/admin-platform/platform/permission/getUserPermission',

  /**
   * 平台登陆用户 权限排除 webview
   */
  PERMISSION_NO_PAGER_URL: '/api/admin-platform/platform/permission/no-page'
}

/**
 * CAS  单点服务器URL配置
 * @type {{VALIDATE_LOGIN: string}}
 */
export const cas_client = {
  /**
   * 验证登陆
   */
  VALIDATE_LOGIN: '/cas/client/validateLogin'
}

//角色管理
const addRole = (params)=>postAction("/api/admin-platform/platform/role/add",params);
const editRole = (params)=>putAction("/api/admin-platform/platform/role/edit",params);
const checkRoleCode = (params)=>getAction("/api/admin-platform/platform/role/checkRoleCode",params);
const queryall = (params)=>getAction("/api/admin-platform/platform/role/queryall",params);

//用户管理
const addUser = (params)=>postAction("/api/admin-platform/platform/user/add",params);
const editUser = (params)=>putAction("/api/admin-platform/platform/user/edit",params);
const queryUserRole = (params)=>getAction("/api/admin-platform/platform/user/queryUserRole",params);
const getUserList = (params)=>getAction("/api/admin-platform/platform/user/list",params);
const frozenBatch = (params)=>putAction("/api/admin-platform/platform/user/frozenBatch",params);

//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/api/admin-platform/platform/user/checkOnlyUser",params);
//改变密码
const changePassword = (params)=>putAction("/api/admin-platform/platform/user/changePassword",params);

//权限管理
const addPermission= (params)=>postAction("/api/admin-platform/platform/permission/add",params);
const editPermission= (params)=>putAction("/api/admin-platform/platform/permission/edit",params);
const getPermissionList = (params)=>getAction("/api/admin-platform/platform/permission/list",params);
const getSystemMenuList = (params)=>getAction("/api/admin-platform/platform/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/api/admin-platform/platform/permission/getSystemSubmenu",params);
const getSystemSubmenuBatch = (params) => getAction('/api/admin-platform/platform/permission/getSystemSubmenuBatch', params)
const queryTreeList = (params)=>getAction("/api/admin-platform/platform/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/api/admin-platform/platform/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/api/admin-platform/platform/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/api/admin-platform/platform/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/api/admin-platform/platform/permission/saveRolePermission",params);
const queryPermissionsByUser = (params)=>getAction("/api/admin-platform/platform/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/api/admin-platform/platform/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/api/admin-platform/platform/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/api/admin-platform/platform/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>getAction("/api/admin-platform/platform/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/api/admin-platform/platform/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/api/admin-platform/platform/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/api/admin-platform/platform/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/api/admin-platform/platform/sysDepart/delete",params);

//二级部门管理
const queryDepartPermission = (params)=>getAction("/api/admin-platform/platform/permission/queryDepartPermission",params);
const saveDepartPermission = (params)=>postAction("/api/admin-platform/platform/permission/saveDepartPermission",params);
const queryTreeListForDeptRole = (params)=>getAction("/api/admin-platform/platform/sysDepartPermission/queryTreeListForDeptRole",params);
const queryDeptRolePermission = (params)=>getAction("/api/admin-platform/platform/sysDepartPermission/queryDeptRolePermission",params);
const saveDeptRolePermission = (params)=>postAction("/api/admin-platform/platform/sysDepartPermission/saveDeptRolePermission",params);
const queryMyDepartTreeList = (params)=>getAction("/api/admin-platform/platform/sysDepart/queryMyDeptTreeList",params);

//日志管理
const deleteLog = (params)=>deleteAction("/api/admin-platform/platform/log/delete",params);
const deleteLogList = (params)=>deleteAction("/api/admin-platform/platform/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/api/admin-platform/platform/dict/add",params);
const editDict = (params)=>putAction("/api/admin-platform/platform/dict/edit",params);
const treeList = (params)=>getAction("/api/admin-platform/platform/dict/treeList",params);
const addDictItem = (params)=>postAction("/api/admin-platform/platform/dictItem/add",params);
const editDictItem = (params)=>putAction("/api/admin-platform/platform/dictItem/edit",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/api/admin-platform/platform/dict/getDictItems/${code}`,params);

//系统通告
const doReleaseData = (params)=>getAction("/api/admin-platform/platform/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/api-platf/platform/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/api-platf/platform/loginfo",params);
const getVisitInfo = (params)=>getAction("/api-platf/platform/visitInfo",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/api-platf/platform/user/queryUserByDepId",params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params)=>getAction("/api-platf/platform/user/queryUserRoleMap",params);
// 重复校验
const duplicateCheck = (params)=>getAction("/api-platf/platform/duplicate/check",params);
// 加载分类字典
const loadCategoryData = (params)=>getAction("/api-platf/platform/category/loadAllData",params);

const checkRuleByCode = (params) => getAction('/api-platf/platform/checkRule/checkByCode', params)

export {
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changePassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  getSystemSubmenuBatch,
  loadCategoryData,
  checkRuleByCode,
  queryDepartPermission,
  saveDepartPermission,
  queryTreeListForDeptRole,
  queryDeptRolePermission,
  saveDeptRolePermission,
  queryMyDepartTreeList
}

