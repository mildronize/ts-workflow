// PoC Concept: https://github.com/thaitype/ts-workflow/issues/1

type PromiseLike<T> = T | Promise<T>;

type PostRunParams = {
  status: 'success' | 'failed';
};

type WorkflowStep<Items, Inputs, TWorkflowSteps, TReturn extends Record<string, unknown>> = (params: {
  var: Items;
  inputs: Inputs;
  steps: TWorkflowSteps;
}) => PromiseLike<TReturn>;

type WorkflowStepParams<
  TName extends string,
  Items,
  Inputs,
  TSteps,
  TRunReturn extends Record<string, unknown>,
  TPostRunReturn
> = {
  name: TName;
  run: WorkflowStep<Items, Inputs, TSteps, TRunReturn>;
  postRun?: (params: PostRunParams) => TPostRunReturn;
};

type WorkflowStepOutput<Items, Inputs, Steps, TReturn extends Record<string, unknown>> = {
  outputs: TReturn;
  /**
   * Internal use only
   */
  _steps: WorkflowStep<Items, Inputs, Steps, TReturn>;
};

type WorkflowOption = {
  postRun?: {
    order: 'asc' | 'desc';
  };
};

// eslint-disable-next-line
export class Workflow<
  Items extends Record<string, unknown> = {},
  Inputs extends Record<string, unknown> = {},
  Outputs extends Record<string, unknown> = {},
  Steps extends Record<string, WorkflowStepOutput<Items, Inputs, Steps, Record<string, unknown>>> = {}
> {
  _variables: Items = {} as Items;
  _inputs: Inputs = {} as Inputs;
  _outputs: Outputs = {} as Outputs;
  _steps: Steps = {} as Steps;

  constructor(protected option?: WorkflowOption) {}

  step<const TName extends string, TReturn extends Record<string, unknown>>({
    name,
    run,
  }: WorkflowStepParams<TName, Items, Inputs, Steps, TReturn, unknown>) {
    this._steps = {
      ...this._steps,
      [name]: run,
    };
    return this as Workflow<
      Items,
      Inputs,
      Outputs,
      Steps & {
        [K in TName]: WorkflowStepOutput<Items, Inputs, Steps, TReturn>;
      }
    >;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as Workflow<Items, Inputs & NewInput, Outputs, Steps>;
  }

  outputs<TReturn extends Record<string, unknown>>(setOutput: WorkflowStep<Items, Inputs, Steps, TReturn>) {
    this._outputs = {
      ...(setOutput({
        var: this._variables,
        inputs: this._inputs,
        steps: this._steps,
      }) as unknown as Outputs),
    };
    return this as Workflow<Items, Inputs, Outputs & TReturn, Steps>;
  }

  async execute() {
    for (const [stepName, item] of Object.entries(this._steps)) {
      console.log(`[workflow] step: ${stepName}`);
      await item._steps({
        var: this._variables,
        inputs: this._inputs,
        steps: this._steps,
      });
    }
    return this._outputs;
  }
}
