// import { Job } from "src/libs/job";

export type OutputReturn = Record<string, unknown>;

// export type JobHandler<TInput, TOutput extends OutputReturn> = (params: {
//   inputs: TInput;
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

export class Job<TInput, TOutput> {
  constructor() {
    console.log('Job created');
  }

  get outputs() {
    return {} as TOutput;
  }
}

// export interface Job<TInput, TOutput>{
//   outputs?: TOutput;
// }

export class Workflow {
  
  createJob<TName extends string, TInput, TOutput, TNeed extends Record<string, Job<string, OutputReturn>> = {}>(
    name: TName,
    options?: {
      env?: AcceptedParser<TInput>;
      // outputs?: AcceptedParser<TOutput>;
      needs?: TNeed;
      handler: (params: {
        env: TInput;
        needs: TNeed;
      }) => TOutput;
    }
  ) {
    return new Job<TInput, TOutput>();
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
