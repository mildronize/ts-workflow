
export type OutputReturn = Record<string, unknown> | void;
export type MayPromise<T> = T | Promise<T>; 

export type AcceptedParser<T> =
  | ((input: unknown) => T)
  | {
      parse: (input: unknown) => T;
    };

export type JobNeedsOutput<TReturn extends OutputReturn> = {
  outputs: TReturn;
};

export class Job<
  Env extends Record<string, unknown>,
  Outputs extends OutputReturn,
  Needs extends Record<string, Job<any, any, any>> = {}
> {
  constructor() {
    console.log('Job created');
  }

  get outputs() {
    return {} as Outputs;
  }

  env<TEnv extends Record<string, unknown>>(parser?: AcceptedParser<TEnv>) {
    return this as unknown as Job<TEnv, Outputs, Needs>;
  }

  needs<TNeed extends Record<string, Job<any, any, any>> = {}>(job: TNeed) {
    return this as unknown as Job<Env, Outputs, TNeed>;
  }

  handler<TOutput extends OutputReturn>(handler: (params: { env: Env; needs: Needs }) => MayPromise<TOutput>) {
    return this as unknown as Job<Env, TOutput, Needs>;
  }
}

export class Workflow {
  job() {
    return new Job();
  }

}

/**
 * In order to design type-safe workflow, we need to make sure that:
 * 1. Seperate one function for a single job
 * 2. The job function should be able to access the outputs of other jobs
 * 3. The job function should be able to receive the inputs of other jobs
 * 4. The job function can process environment variables
 */
export function jobWrapper() {}
