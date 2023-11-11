// PoC Concept: https://github.com/thaitype/ts-workflow/issues/1

type PromiseLike<T> = T | Promise<T>;

type PostRunParams = {
  status: 'success' | 'failed';
};

type WorkflowRun<Items, Inputs, Steps, TReturn extends Record<string, unknown>> = (params: {
  var: Items;
  inputs: Inputs;
  steps: Steps;
}) => PromiseLike<TReturn>;

type WorkflowStepParams<
  TName extends string,
  Items,
  Inputs,
  Steps,
  TRunReturn extends Record<string, unknown>,
  TPostRunReturn
> = {
  name: TName;
  run: WorkflowRun<Items, Inputs, Steps, TRunReturn>;
  postRun?: (params: PostRunParams) => TPostRunReturn;
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
  Steps extends Record<string, WorkflowRun<Items, Inputs, Steps, Record<string, unknown>>> = {}
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
    return this as Workflow<Items, Inputs, Steps & {
      [K in TName]: WorkflowRun<Items, Inputs, Steps, TReturn>;
    }>;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as Workflow<Items, Inputs & NewInput>;
  }

  async execute() {
    for (const [name, step] of Object.entries(this._steps)) {
      console.log(`[workflow] step: ${name}`);
      const result = await step({
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
