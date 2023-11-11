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

type Output2<Items, Inputs, Steps, TReturn extends Record<string, unknown>> = {
  outputs: WorkflowStep<Items, Inputs, Steps, TReturn>;
};

type Output<Items, Inputs, Steps, TReturn extends Record<string, unknown>> = {
  outputs: TReturn;
  _steps: WorkflowStep<Items, Inputs, Steps, TReturn>
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
  Steps extends Record<string, Output<Items, Inputs, Steps, Record<string, unknown>>> = {}
> {
  _variables: Items = {} as Items;
  _inputs: Inputs = {} as Inputs;
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
      Steps & {
        [K in TName]: Output<Items, Inputs, Steps, TReturn>;
      }
    >;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as Workflow<Items, Inputs & NewInput>;
  }

  async execute() {
    for (const [name, item] of Object.entries(this._steps)) {
      console.log(`[workflow] step: ${name}`);
      const result = await item._steps({
        var: this._variables,
        inputs: this._inputs,
        steps: this._steps,
      });
      this._variables = {
        ...this._variables,
        ...(result as unknown as Items),
      };
    }
    return this._variables;
  }
}
