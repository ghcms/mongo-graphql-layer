import { ProjectionInterface } from "../database/parseQuery";
import execGroupedHook from "./execGroupedHook";
import SchemaFunction from "./funcExec";
import { groupedHookType } from "./groupHooks";

// Process all the preRequest hooks
const preHookProjectionArray = (input: {
    hooks: groupedHookType,
    params:  {[key: string]: string;}
    cookies: {[key: string]: string;}
    headers: {[key: string]: string;}
    value?: any
    projection: {
        preSchema: ProjectionInterface,
        postSchema: ProjectionInterface
    }
}): Promise<Array<ProjectionInterface>> => {
    return new Promise(async(resolve) => {
        // Promise array to store the projection promises
        let promiseArray: Array<Promise<ProjectionInterface>> = [];

        // Go through each preRequest hook and execute it
        input.hooks.forEach(async(hooks) => promiseArray.push(execGroupedHook(hooks, {
            urlParams: input.params,
            cookies: input.cookies,
            headers: input.headers,

            projection: {
                preSchema: input.projection.preSchema,
                postSchema: input.projection.postSchema,
            },

            value: input.value,
        })));

        // Resolve the array of promises
        return resolve(await Promise.all(promiseArray) as Array<ProjectionInterface>);
    });
}

export default preHookProjectionArray;