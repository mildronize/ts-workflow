// PoC Concept: https://github.com/thaitype/ts-Job/issues/1

export type PromiseLike<T> = T | Promise<T>;

export type PostRunParams = {
  status: 'success' | 'failed';
};

export type JobStep<Inputs, TJobSteps, TReturn extends Record<string, unknown>> = (params: {
  inputs: Inputs;
  steps: TJobSteps;
}) => PromiseLike<TReturn>;

export type JobStepParams<
  TName extends string,
  TInputs,
  TSteps,
  TRunReturn extends Record<string, unknown>,
  TPostRunReturn
> = {
  name: TName;
  run: JobStep<TInputs, TSteps, TRunReturn>;
  postRun?: (params: PostRunParams) => TPostRunReturn;
};

export type JobStepOutput<Inputs, Steps, TReturn extends Record<string, unknown>> = {
  outputs: TReturn;
  /**
   * Internal use only
   */
  _steps: JobStep<Inputs, Steps, TReturn>;
};

export type JobOption = {
  postRun?: {
    order: 'asc' | 'desc';
  };
};

export type JobOutput<TReturn extends Record<string, unknown>> = {
  outputs: TReturn;
};

// eslint-disable-next-line
export class Job<
  Inputs extends Record<string, unknown> = {},
  Outputs extends Record<string, unknown> = {},
  Steps extends Record<string, JobStepOutput<Inputs, Steps, Record<string, unknown>>> = {}
> {
  protected _inputs: Inputs = {} as Inputs;
  protected _outputs: Outputs = {} as Outputs;
  protected _steps: Steps = {} as Steps;

  constructor(protected option?: JobOption) {}

  step<const TName extends string, TReturn extends Record<string, unknown>>({
    name,
    run,
  }: JobStepParams<TName, Inputs, Steps, TReturn, unknown>) {
    this._steps = {
      ...this._steps,
      [name]: run,
    };
    return this as Job<
      Inputs,
      Outputs,
      Steps & {
        [K in TName]: JobStepOutput<Inputs, Steps, TReturn>;
      }
    >;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as Job<Inputs & NewInput, Outputs, Steps>;
  }

  outputs<TReturn extends Record<string, unknown>>(setOutput: JobStep<Inputs, Steps, TReturn>) {
    this._outputs = {
      ...(setOutput({
        inputs: this._inputs,
        steps: this._steps,
      }) as unknown as Outputs),
    };
    return this as Job<Inputs, Outputs & TReturn, Steps>;
  }

  async execute() {
    for (const [stepName, item] of Object.entries(this._steps)) {
      console.log(`[Job] step: ${stepName}`);
      await item._steps({
        inputs: this._inputs,
        steps: this._steps,
      });
    }
    return this._outputs;
  }
}

export function createJob(jobOption?: JobOption) {
  return new Job(jobOption);
}
