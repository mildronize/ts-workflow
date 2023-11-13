import { Job, createWorkflow } from '../libs';

let workflow = createWorkflow({
  jobOptions: {
    postRun: {
      order: 'asc',
    },
  },
});

workflow
  .addJob({
    name: 'job1',
    job: job => job.inputs({ name: 'name' }).outputs(({ inputs }) => ({ name: inputs.name })).getOutputs(),
  })
  .addJob({
    name: 'job2',
    job: job =>
      job.step({
        name: 'step1',
        run: ({ steps }) => {
          console.log('job2');
          return {
            result: 'job2',
          };
        },
      }).getOutputs(),
  })
  .addJob({
    name: 'job3',
    job: job =>
      job
        .needs('job1')
        .inputs({ projectPath: '/name' })
        .step({
          name: 'step1',
          run: ({ steps, needs }) => {
            const result = needs.job1.outputs;
                    // ^?
          },
        }).getOutputs(),
  });

type Needs = {
  job1: {
    outputs: {
      result: string;
    };
  };
  job2: {
    outputs: {
      data: string;
    };
  };
};
const job = new Job<{}, {}, {}, Needs>();

const out = job
  .needs('job2')
  .step({
    name: 'step1',
    run: ({ steps, needs }) => {
      // needs.job1.outputs
      const result = needs.job2.outputs.data;
      // ^?
    },
  })
  .outputs(() => ({
    data: 'data',
  }))
  .getOutputs();
