
// PoC Concept: https://github.com/thaitype/ts-workflow/issues/1


/**
 * Typed Function that satifies arguments `T[]` and return type `R`
 */
export type TypedFunction<T extends any[], R> = (...args: T) => R;

type PromiseLike<T> = T | Promise<T>;

type PostRunParams = {
  status: 'success' | 'failed';
};

type WorkflowRun<Items, TReturn extends Record<string, unknown>> = TypedFunction<[Items], PromiseLike<TReturn>>;
type WorkflowStepParams<Items, TRunReturn extends Record<string, unknown>, TPostRunReturn> = {
  name: string;
  run: WorkflowRun<Items, TRunReturn>;
  postRun?: TypedFunction<[PostRunParams], TPostRunReturn>;
};

type WorkflowOption = {
  postRun?: {
    order: 'asc' | 'desc';
  };
};

// eslint-disable-next-line
export class Workflow<Items extends Record<string, unknown> = {}> {
  variables: Items = {} as Items;
  steps: WorkflowRun<Items, Record<string, unknown>>[] = [];

  constructor(protected option?: WorkflowOption) {}

  step<TReturn extends Record<string, unknown>>({ run }: WorkflowStepParams<Items, TReturn, unknown>) {
    this.steps.push(run);
    return this as Workflow<Items & TReturn>;
  }

  input<NewItem extends Record<string, unknown>>(value: NewItem) {
    this.variables = {
      ...(value as unknown as Items),
    };
    return this as Workflow<Items & NewItem>;
  }

  async execute() {
    for (const step of this.steps) {
      const result = await step(this.variables);
      this.variables = {
        ...this.variables,
        ...(result as unknown as Items),
      };
    }
    return this.variables;
  }
}


