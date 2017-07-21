import 'babel-polyfill'; /* 在应用中其它任何代码执行前调用一次 */

import React from 'react';
import { render } from 'react-dom';

import callFetch from './utils/callFetch';

callFetch({
    api: `/api/customer/shop/getAllCourse`,
    data: {
        s: 1,
    },
    clientError: (httpStatus, reqData) => {
        
    },
});

render((
    <div>
        <h1>Nicholas</h1>
    </div>
    ), document.getElementById('appContainer')
);
