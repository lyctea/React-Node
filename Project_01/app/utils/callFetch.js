import fetch from 'isomorphic-fetch'; /* 每次使用 `fetch` 前都这样调用一下 */

import _fetch from '../lib/_fetch.js';
import toFormData from '../lib/toFormData.js';

import * as APP_CONFIG from './app_config';

/**
 * 获取数据
 * @param {*} opts
 * opts.api
 * opts.callback
 */
const callFetch = async function (opts) {
    let {
        api = '',
        method = 'GET',
        headers = null,
        timeoutBound = APP_CONFIG.timeoutBound * 1000, /* 超时等待时间，默认使用全局配置的 */
        dataType = 'form',
        data = null,
        credentials = 'include', /* 将凭证也带上（例如cookies） */
        success = null,
        redirect = null,
        clientError = null,
        serverError = null,
        timeout = null,
    } = opts;

    let postData = null;
    let param = {};

    param.method = method;

    if (data && method.toUpperCase() === 'POST') {
        switch (dataType) {
            case 'json':
                headers = {};

                Object.assign(headers, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                });

                param.body = JSON.stringify(data);
                break;
            case 'form':
            default:
                param.body = toFormData(data);
        }

        param.credentials = credentials;
    }

    headers && (param.headers = headers);

    let httpStatus = 1000; /* 若请求完接口还没改变此值，则视为timeout 超时 */

    let result = await _fetch(fetch(api, param), timeoutBound)
                        .then(function(response) {
                            httpStatus = response.status;

                            return response.json();
                        }, function(err) {
                            return err;
                        });

    switch (true) {
        case (httpStatus >= 200 && httpStatus < 300):
            success && success(httpStatus, result);
            break;
        case (httpStatus >= 300 && httpStatus < 400):
            redirect && redirect(httpStatus, result);
            break;
        case (httpStatus >= 400 && httpStatus < 500):
            clientError && clientError(httpStatus, result);
            break;
        case (httpStatus >= 500 && httpStatus < 600):
            serverError && serverError(httpStatus, result);
            break;
        default:
            timeout && timeout();
            break;
    }
};

export default callFetch;
