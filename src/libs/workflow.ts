import { Job } from './job';

export interface WorkflowOption {}

export class Workflow<WorkflowJobs extends Record<string, Job> = {}> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;

  constructor(option?: WorkflowOption) {}
  job<const TName extends string,  const TNeed extends keyof WorkflowJobs | undefined>(
    params: {
      name: TName;
      job: (w: WorkflowHelper<WorkflowJobs>) => WorkflowJobs[TName];
      needs?: (w: WorkflowHelper<WorkflowJobs>) => TNeed[];
    },

  ) {
    return this as Workflow<WorkflowJobs & { [K in TName]: Job }>;
  }
  
}

export function createWorkflow(option?: WorkflowOption) {
  return new Workflow(option);
}

export class WorkflowHelper<WorkflowJobs extends Record<string, Job> = {}> {
  needs<const TNeed extends keyof WorkflowJobs>(...args: TNeed[]) {
    return args;
  }

  job(){
    return new Job();
  }
}