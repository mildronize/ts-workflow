import { Job, JobNeedsOutput, JobOption, JobStepOutput, JobStepReturn } from './job';

export interface WorkflowOption {
  jobOptions?: JobOption;
}

export interface AddJobParams<
  TName extends string,
  WorkflowJobs extends Record<string, Job>,
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  name: TName;
  job: (w: WorkflowJobHelper<WorkflowJobs, Needs>) => WorkflowJobs[TName];
}

export class Workflow<
  WorkflowJobs extends Record<string, Job<{}, {}, {}, Needs>> = {},
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;
  protected _needs: Needs = {} as Needs;

  constructor(option?: WorkflowOption) {}

  addJob<const TName extends string, const TNeed extends keyof WorkflowJobs>(
    params: AddJobParams<TName, WorkflowJobs, Needs & Record<TNeed, JobNeedsOutput<JobStepReturn>>>
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
  /**
   * All available needs that already registered in the workflow
   */
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  constructor(protected option?: WorkflowOption) {}

  protected _needs: Needs = {} as Needs;

  create() {
    return new Job<{}, {}, {}, Needs>(this.option?.jobOptions);
  }
}
