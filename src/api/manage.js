import { request } from '@/utils/request'

//post
export function postAction(url,parameter) {
  return request({
    url: url,
    method:'post' ,
    data: parameter
  })
}

//post method= {post | put}
export function httpAction(url,parameter,method) {
  return request({
    url: url,
    method:method ,
    data: parameter
  })
}

//put
export function putAction(url,parameter) {
  return request({
    url: url,
    method:'put',
    data: parameter
  })
}

//get
export function getAction(url,parameter) {
  return request({
    url: url,
    method: 'get',
    params: parameter
  })
}

//deleteAction
export function deleteAction(url,parameter) {
  return request({
    url: url,
    method: 'delete',
    params: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url,parameter){
  return request({
    url: url,
    params: parameter,
    method:'get' ,
    responseType: 'blob'
  })
}

/**
 * 获取文件访问路径
 * @param avatar
 * @param imgerver
 * @param str
 * @returns {*}
 */
export function getFileAccessHttpUrl(avatar,imgerver,subStr) {
  if(avatar && avatar.indexOf(subStr) != -1 ){
    return avatar;
  }else{
    return imgerver + "/" + avatar;
  }
}