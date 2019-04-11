import {successResponse, runWarm} from './utils';
import models from './models';

const getMetric = (event, context, callback) => {
    const {id} = event.pathParameters;
    models.Metric.findById(id).then((metric) => {
        const response = successResponse({
            metric,
        });
    
        callback(null, response);
    });
};

export default runWarm(getMetric);
