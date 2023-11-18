// import { Job } from "src/libs/job";

export type OutputReturn = Record<string, unknown>;

// export type JobHandler<TEnv, TOutput extends OutputReturn> = (params: {
//   inputs: TEnv;
//   outputs: TOutput;
//   env: any;
//   needs: unknown;
// }) => TOutput;

export type AcceptedParser<T> =
  | ((input: unknown) => T)
  | {
      parse: (input: unknown) => T;
    };

export type JobNeedsOutput<TReturn extends OutputReturn> = {
  outputs: TReturn;
};

export class Job<Env extends Record<string, unknown>, Outputs, Needs extends Record<string, Job<any, any, any>> = {}> {
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

  handler<TOutput>(handler: (params: { env: Env; needs: Needs }) => TOutput) {
    return this as unknown as Job<Env, TOutput, Needs>;
  }
}

// export interface Job<TEnv, TOutput>{
//   outputs?: TOutput;
// }

export class Workflow {
  createJob() {
    return new Job();
  }

  // createJob<TName extends string, TEnv, TOutput, TNeed extends Record<string, Job<string, OutputReturn>> = {}>(
  //   name: TName,
  //   options?: {
  //     env?: AcceptedParser<TEnv>;
  //     // outputs?: AcceptedParser<TOutput>;
  //     needs?: TNeed;
  //     handler: (params: {
  //       env: TEnv;
  //       needs: TNeed;
  //     }) => TOutput;
  //   }
  // ) {
  //   return new Job<TEnv, TOutput>();
  // }
}

/**
 * In order to design type-safe workflow, we need to make sure that:
 * 1. Seperate one function for a single job
 * 2. The job function should be able to access the outputs of other jobs
 * 3. The job function should be able to receive the inputs of other jobs
 * 4. The job function can process environment variables
 */
export function jobWrapper() {}
