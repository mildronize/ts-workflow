// PoC Concept: https://github.com/thaitype/ts-Job/issues/1

export type PromiseLike<T> = T | Promise<T>;

export type PostRunParams = {
  status: 'success' | 'failed';
};
export type JobStepReturn = Record<string, unknown> | void;

export type JobStep<Inputs, TJobSteps, TReturn extends JobStepReturn, Needs> = (params: {
  inputs: Inputs;
  steps: TJobSteps;
  needs: Needs;
}) => PromiseLike<TReturn>;

export type JobStepParams<
  TName extends string,
  TInputs,
  TSteps,
  TRunReturn extends JobStepReturn,
  TPostRunReturn,
  Needs
> = {
  name: TName;
  run: JobStep<TInputs, TSteps, TRunReturn, Needs>;
  postRun?: (params: PostRunParams) => TPostRunReturn;
};

export type JobStepOutput<
  Inputs,
  Steps,
  TReturn extends JobStepReturn,
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>>
> = {
  outputs: TReturn;
  /**
   * Internal use only
   */
  _steps: JobStep<Inputs, Steps, TReturn, Needs>;
};

export type JobOption = {
  postRun?: {
    order: 'asc' | 'desc';
  };
};

export type JobOutput<TReturn extends JobStepReturn> = {
  outputs: TReturn;
};

export type JobNeedsOutput<TReturn extends JobStepReturn> = {
  outputs: TReturn;
};

// eslint-disable-next-line
export class Job<
  Inputs extends Record<string, unknown> = {},
  Outputs extends Record<string, unknown> = {},
  Steps extends Record<string, JobStepOutput<Inputs, Steps, JobStepReturn, Needs>> = {},
  /**
   * Needs satisfies the Record of `jobName` and `JobNeedsOutput`
   */
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  protected _inputs: Inputs = {} as Inputs;
  protected _outputs: Outputs = {} as Outputs;
  protected _steps: Steps = {} as Steps;
  protected _needs: Needs = {} as Needs;

  constructor(protected option?: JobOption) {}

  step<const TName extends string, TReturn extends JobStepReturn>({
    name,
    run,
  }: JobStepParams<TName, Inputs, Steps, TReturn, unknown, Needs>) {
    this._steps = {
      ...this._steps,
      [name]: run,
    };
    const data = {} as JobStepOutput<Inputs, Steps, TReturn, Needs>;
    return this as Job<
      Inputs,
      Outputs,
      Steps & {
        [K in TName]: JobStepOutput<Inputs, Steps, TReturn, Needs>;
      },
      Needs
    >;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as Job<Inputs & NewInput, Outputs, Steps, Needs>;
  }

  outputs<TReturn extends JobStepReturn>(setOutput: JobStep<Inputs, Steps, TReturn, Needs>) {
    this._outputs = {
      ...(setOutput({
        inputs: this._inputs,
        steps: this._steps,
        needs: {} as Needs,
      }) as unknown as Outputs),
    };
    return this as Job<Inputs, Outputs & TReturn, Steps, Needs>;
  }

  async execute() {
    for (const [stepName, item] of Object.entries(this._steps)) {
      console.log(`[Job] step: ${stepName}`);
      await item._steps({
        inputs: this._inputs,
        steps: this._steps,
        needs: {} as Needs,
      });
    }
    return this._outputs;
  }
}

export function createJob(jobOption?: JobOption) {
  return new Job(jobOption);
}
