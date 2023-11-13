import { Job, JobNeedsOutput, JobOption, JobStepOutput, JobStepReturn } from './job';

export interface WorkflowOption {
  jobOptions?: JobOption;
}

// type KeyOfString<T> = keyof T extends string ? T : never;
type KeyOfString<T> = Extract<keyof T, string>;

// export interface AddJobParams<
//   TName extends string,
//   WorkflowJobs extends Record<string, Job>,
//   TOutputs extends Record<string, unknown>,
//   /**
//    * All available needs that already registered in the workflow
//    */
//   Needs extends Record<string, JobNeedsOutput<JobStepReturn<Record<string, unknown>>>> = {}
// > {
//   name: TName;
//   job: (w: Job<{}, TOutputs, {}, Needs>) => WorkflowJobs[TName];
// }

export class Workflow<
  WorkflowJobs extends Record<string, Job<{}, {}, {}, Needs>> = {},
  Needs extends Record<string, JobNeedsOutput<JobStepReturn<Record<string, unknown>>>> = {},
  OutputsOfJob extends Record<string, JobStepReturn<Record<string, unknown>>> = {}
> {
  protected _jobs: WorkflowJobs = {} as WorkflowJobs;
  protected _needs: Needs = {} as Needs;

  constructor(option?: WorkflowOption) {}

  addJob<const TName extends string, const TNeed extends keyof WorkflowJobs, TOutputs extends JobStepReturn<Record<string, unknown>>>(
    // params: AddJobParams<
    //   TName,
    //   WorkflowJobs,
    //   TOutputs,
    //   Needs & Record<TNeed, JobNeedsOutput<JobStepReturn<ReturnType<WorkflowJobs[TNeed]['getOutputs']>>>>
    // >
    params: {
      name: TName;
      job: (
        w: Job<
          {},
          {},
          {},
          Needs & Record<TNeed, JobNeedsOutput<TOutputs>>
        >
      ) => TOutputs;
    }

    // params: AddJobParams<TName, WorkflowJobs, Needs & Record<TNeed, JobNeedsOutput<{
    //   'test': 'test'
    // }>>>

    // & {
    //   [K in keyof WorkflowJobs]: JobStepReturn<ReturnType<WorkflowJobs[K]['getOutputs']>>
    // }

    // {
    //   [K in keyof Outputs]: JobStepReturn<Outputs[K]>
    // }
  ) {
    return this as Workflow<
      WorkflowJobs & {
        [K in TName]: Job<{}, {}, {}, Needs>;
      },
      Needs,
      OutputsOfJob
    >;

    // {
    // [K in KeyOfString<WorkflowJobs>]: JobStepReturn<ReturnType<WorkflowJobs[K]['getOutputs']>>;
    //
  }
}

export function createWorkflow(option?: WorkflowOption) {
  return new Workflow(option);
}

// export class WorkflowJobHelper<
//   WorkflowJobs extends Record<string, Job> = {},
//   /**
//    * All available needs that already registered in the workflow
//    */
//   Needs extends Record<string, JobNeedsOutput<JobStepReturn>> = {}
// > {
//   constructor(protected option?: WorkflowOption) {}

//   protected _needs: Needs = {} as Needs;

//   create() {
//     return new Job<{}, {}, {}, Needs>(this.option?.jobOptions);
//   }
// }
