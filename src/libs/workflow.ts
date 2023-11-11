import { Job, JobOption } from './job';

export interface WorkflowOption {
  jobOptions?: JobOption;
}

export class Workflow<WorkflowJobs extends Record<string, Job> = {}> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;

  constructor(option?: WorkflowOption) {}
  addJob<const TName extends string, const TNeed extends keyof WorkflowJobs | undefined>(params: {
    name: TName;
    job: (w: WorkflowJobHelper<WorkflowJobs>) => WorkflowJobs[TName];
    needs?: (w: WorkflowJobHelper<WorkflowJobs>) => TNeed[];
  }) {
    return this as Workflow<WorkflowJobs & { [K in TName]: Job }>;
  }
}

export function createWorkflow(option?: WorkflowOption) {
  return new Workflow(option);
}

export class WorkflowJobHelper<WorkflowJobs extends Record<string, Job> = {}> {
  constructor(protected option?: WorkflowOption) {}
  needs<const TNeed extends keyof WorkflowJobs>(...args: TNeed[]) {
    return args;
  }

  create() {
    return new Job(this.option?.jobOptions);
  }
}
