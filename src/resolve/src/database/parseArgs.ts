import _ from 'lodash';
import { arrayToObject } from '../../../general';
import { MongoResponseObject } from './interface';

export default (contex:any): MongoResponseObject => {
    let returnable: MongoResponseObject = {};

    // Walk the paramaters
    const walk = (data: any, parentName: string[] = []) => {
        for (const key in data) {
            const value = data[key];

            if(value.value.kind === 'ObjectValue')
                walk(value.value.fields, [...parentName, value.name.value]);
            
            else {
                let paramater = value?.value?.value;

                if(paramater === undefined && value?.value?.values) {
                    let paramArray: Array<any> = [];

                    value.value.values.forEach((value: any) => {
                        paramArray.push(convert(value.kind, value.value));
                    });

                    paramater = paramArray;
                } else paramater = convert(value.kind, paramater);

                // returnable[value.name.value] = paramater;
                _.merge(returnable, arrayToObject([...parentName, value.name.value], paramater));
            }
        }
    }

    walk(contex.arguments);

    return returnable;
}

//https://github.com/apollographql/apollo-server/blob/e468367d52e11f3127597e4fe920eb8294538289/packages/apollo-server-core/src/plugin/usageReporting/defaultUsageReportingSignature.ts
const convert = (type: string, value: any): number | Float64Array | string | Array<any> | {} => {
    switch (type) {
        case 'IntValue':
            return parseInt(value.value, 10);

        case 'FloatValue':
            return parseFloat(value.value);

        case 'StringValue':
            return value;

        case 'ListValue':
            return value as Array<any>;
            
        case 'ObjectValue':
            return value as {};

        default:
            return value;
    }
}