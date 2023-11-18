export type OutputReturn = Record<string, unknown>;

export type JobHandler<TOutput extends OutputReturn> = (params: {
  inputs: any;
  outputs: TOutput;
  env: any;
  needs: unknown;
}) => TOutput;

export class Job<TOutput extends OutputReturn> {
  constructor() {
    console.log('Job created');
  }
}

export class Workflow {
  createJob<TOutput extends OutputReturn>(name: string) {
    return this;
  }

  input(inputSchema: any) {
    return this;
  }

  need<TOutput extends OutputReturn>(job: Job<TOutput>) {
    return this;
  }

  jobHandler<TOutput extends OutputReturn>(params: JobHandler<TOutput>) {
    return new Job<TOutput>();
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
