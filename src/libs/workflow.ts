import { Job, JobNeedsOutput, JobOption, JobStepOutput, JobStepReturn } from './job';

export interface WorkflowOption {
  jobOptions?: JobOption;
}

export interface AddJobParams<
  TName extends string,
  WorkflowJobs extends Record<string, Job>,
  TNeed extends keyof WorkflowJobs,
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  name: TName;
  job: (w: WorkflowJobHelper<WorkflowJobs, Needs>) => WorkflowJobs[TName];
  // needs?: (w: WorkflowJobHelper<WorkflowJobs, Needs>) => TNeed[];
}

export class Workflow<
  WorkflowJobs extends Record<string, Job<{}, {}, {}, Needs>> = {},
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;
  protected _needs: Needs = {} as Needs;

  constructor(option?: WorkflowOption) {}

  addJob<const TName extends string, const TNeed extends keyof WorkflowJobs>(
    params: AddJobParams<TName, WorkflowJobs, TNeed, Needs & Record<TNeed, JobNeedsOutput<JobStepReturn>>>
  ) {
    return this as Workflow<
      WorkflowJobs & {
        [K in TName]: Job;
      },
      Needs
    >;
  }
}

export function createWorkflow(option?: WorkflowOption) {
  return new Workflow(option);
}

export class WorkflowJobHelper<
  WorkflowJobs extends Record<string, Job> = {},
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  constructor(protected option?: WorkflowOption) {}

  protected _needs: Needs = {} as Needs;
  // /**
  //  * Needs function helper for type interferance
  //  */
  // needs<const TNeed extends keyof WorkflowJobs>(...args: TNeed[]) {
  //   // TODO: Mock type, implement later
  //   return {} as TNeed[];
  // }

  // need<const TNeed extends keyof WorkflowJobs>(need: TNeed) {
  //   this._needs = {
  //     ...this._needs,
  //     [need]: {} as JobNeedsOutput<JobStepReturn>,
  //   };
  //   return this as WorkflowJobHelper<
  //     WorkflowJobs,
  //     Needs & {
  //       [K in TNeed]: JobNeedsOutput<JobStepReturn>;
  //     }
  //   >;
  // }

  getNeeds() {
    return Object.keys(this._needs) as (keyof WorkflowJobs)[];
  }

  create() {
    return new Job<{}, {}, {}, Needs>(this.option?.jobOptions);
  }
}
