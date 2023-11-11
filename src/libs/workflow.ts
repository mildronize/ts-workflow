import { Job } from './job';

export interface WorkflowOption {}

export class Workflow<WorkflowJobs extends Record<string, Job> = {}> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;

  constructor(option?: WorkflowOption) {}
  job<const TName extends string,  const TNeed extends keyof WorkflowJobs | undefined>(
    params: {
      name: TName;
      job: Job
      needs?: (w: Workflow<WorkflowJobs>) => TNeed;
    },

  ) {
    return this as Workflow<WorkflowJobs & { [K in TName]: Job }>;
  }

  createJob() {
    return new Job();
  }

  needs<const TNeed extends keyof WorkflowJobs>(...args: TNeed[]) {
    // TODO: Trickky type, fix later
    return args as unknown as TNeed;
  }
}

export function createWorkflow(option?: WorkflowOption) {
  return new Workflow(option);
}
