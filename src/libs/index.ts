
// PoC Concept: https://github.com/thaitype/ts-workflow/issues/1

type PromiseLike<T> = T | Promise<T>;

type PostRunParams = {
  status: 'success' | 'failed';
};

type WorkflowRun<Items, Inputs, TReturn extends Record<string, unknown>> = (params: {var: Items, inputs: Inputs}) => PromiseLike<TReturn>;

type WorkflowStepParams<Items, Inputs, TRunReturn extends Record<string, unknown>, TPostRunReturn> = {
  name: string;
  run: WorkflowRun<Items, Inputs, TRunReturn>;
  postRun?: (params: PostRunParams) => TPostRunReturn;
};

type WorkflowOption = {
  postRun?: {
    order: 'asc' | 'desc';
  };
};

// eslint-disable-next-line
export class Workflow<Items extends Record<string, unknown> = {}, Inputs extends Record<string, unknown> = {}> {
  _variables: Items = {} as Items;
  _inputs: Inputs = {} as Inputs;
  _steps: WorkflowRun<Items, Inputs, Record<string, unknown>>[] = [];

  constructor(protected option?: WorkflowOption) {}

  step<TReturn extends Record<string, unknown>>({ run }: WorkflowStepParams<Items, Inputs, TReturn, unknown>) {
    this._steps.push(run);
    return this as Workflow<Items & TReturn, Inputs>;
  }

  inputs<NewInput extends Record<string, unknown>>(value: NewInput) {
    this._inputs = {
      ...(value as unknown as Inputs),
    };
    return this as Workflow<Items, Inputs & NewInput>;
  }

  async execute() {
    for (const step of this._steps) {
      const result = await step({
        var: this._variables,
        inputs: this._inputs,
      });
      this._variables = {
        ...this._variables,
        ...(result as unknown as Items),
      };
    }
    return this._variables;
  }
}


