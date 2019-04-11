import {successResponse, runWarm} from './utils';

const hello = (event, context, callback) => {
    const response = successResponse({
        message: "I'm alive!",
    });

    callback(null, response);
};

export default runWarm(hello);
