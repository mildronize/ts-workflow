import { Job, JobNeedsOutput, JobOption, JobStepOutput, JobStepReturn } from './job';

export interface WorkflowOption {
  jobOptions?: JobOption;
}

export interface AddJobParams<
  TName extends string,
  WorkflowJobs extends Record<string, Job>,
  TNeed extends keyof WorkflowJobs | ''
> {
  name: TName;
  job: (w: WorkflowJobHelper<WorkflowJobs>) => WorkflowJobs[TName];
  needs?: (w: WorkflowJobHelper<WorkflowJobs>) => TNeed[];
}

export class Workflow<
  WorkflowJobs extends Record<string, Job<{}, {}, {}, Needs>> = {},
  Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;
  protected _needs: Needs = {} as Needs;

  constructor(option?: WorkflowOption) {}
  addJob<
    const TName extends string,
    const TNeed extends keyof WorkflowJobs | ''
  >(params: AddJobParams<TName, WorkflowJobs, TNeed>) {
    const data = {} as Job<{}, {}, {}, Needs>;
    return this as Workflow<
      WorkflowJobs & {
        [K in TName]: Job<{}, {}, {}, Needs>;
      },
      Needs & {
        [K in TName]: JobNeedsOutput<JobStepReturn>;
      }
    >;
  }
}

export function createWorkflow(option?: WorkflowOption) {
  return new Workflow(option);
}

export class WorkflowJobHelper<WorkflowJobs extends Record<string, Job> = {}> {
  constructor(protected option?: WorkflowOption) {}
  /**
   * Needs function helper for type interferance
   */
  needs<const TNeed extends keyof WorkflowJobs>(...args: TNeed[]) {
    return args;
  }

  create() {
    return new Job(this.option?.jobOptions);
  }
}
