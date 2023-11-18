// PoC Concept: https://github.com/thaitype/ts-Job/issues/1

export type MayPromise<T> = T | Promise<T>;

export type PostRunParams = {
  status: 'success' | 'failed';
  /**
   * Previous step return value, it depends on the order of the step
   */
  previous: unknown;
};
export type JobStepReturn<T extends Record<string, unknown>> = T | void;

export type JobStep<Inputs, TJobSteps, TReturn extends JobStepReturn<Record<string, unknown>>, Needs> = (params: {
  inputs: Inputs;
  steps: TJobSteps;
  needs: Needs;
}) => MayPromise<TReturn>;

export type JobStepParams<
  TName extends string,
  TInputs,
  TSteps,
  TRunReturn extends JobStepReturn<Record<string, unknown>>,
  TPostRunReturn,
  Needs
> = {
  id?: TName;
  run: JobStep<TInputs, TSteps, TRunReturn, Needs>;
  postRun?: (params: PostRunParams) => TPostRunReturn;
};

export type JobStepOutput<
  Inputs,
  Steps,
  TReturn extends JobStepReturn<Record<string, unknown>>,
  Needs extends Record<string, JobNeedsOutput<JobStepReturn<Record<string, unknown>>>>
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

export type JobOutput<TReturn extends JobStepReturn<Record<string, unknown>>> = {
  outputs: TReturn;
};

export type JobNeedsOutput<TReturn extends JobStepReturn<Record<string, unknown>>> = {
  outputs: TReturn;
};

// eslint-disable-next-line
export class OrderedPipeline<
  Inputs extends Record<string, unknown> = {},
  Outputs extends Record<string, unknown> = {},
  Steps extends Record<string, JobStepOutput<Inputs, Steps, JobStepReturn<Record<string, unknown>>, Needs>> = {},
  /**
   * All available needs that already registered in the workflow
   *
   * Needs satisfies the Record of `jobName` and `JobNeedsOutput`
   */
  Needs extends Record<string, JobNeedsOutput<JobStepReturn<Record<string, unknown>>>> = {},
  /**
   * Selected Needs job depenedencies
   */
  NeedsOutput extends Record<string, JobNeedsOutput<JobStepReturn<Record<string, unknown>>>> = {}
> {
  protected _inputs: Inputs = {} as Inputs;
  protected _outputs: Outputs = {} as Outputs;
  protected _steps: Steps = {} as Steps;
  protected _needs: Needs = {} as Needs;

  constructor(protected option?: JobOption) {}

  step<const TName extends string, TReturn extends JobStepReturn<Record<string, unknown>>>({
    id,
    run,
  }: JobStepParams<TName, Inputs, Steps, TReturn, unknown, NeedsOutput>) {
    if (id)
      this._steps = {
        ...this._steps,
        [id]: run,
      };
    const data = {} as JobStepOutput<Inputs, Steps, TReturn, Needs>;
    return this as OrderedPipeline<
      Inputs,
      Outputs,
      Steps & {
        [K in TName]: JobStepOutput<Inputs, Steps, TReturn, Needs>;
      },
      Needs,
      NeedsOutput
    >;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as OrderedPipeline<Inputs & NewInput, Outputs, Steps, Needs, NeedsOutput>;
  }

  outputs<TReturn extends JobStepReturn<Record<string, unknown>>>(setOutput: JobStep<Inputs, Steps, TReturn, Needs>) {
    this._outputs = {
      ...(setOutput({
        inputs: this._inputs,
        steps: this._steps,
        needs: {} as Needs,
      }) as unknown as Outputs),
    };
    return {} as TReturn;
  }

  getOutputs() {
    return this._outputs;
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
  return new OrderedPipeline(jobOption);
}
