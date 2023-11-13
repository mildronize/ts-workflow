import { createWorkflow } from '../libs';

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
    job: job =>
      job
        .create()
        .inputs({ name: 'name' })
        .outputs(({ inputs }) => ({ name: inputs.name })),
  })
  .addJob({
    name: 'job2',
    job: job =>
      job.create().step({
        name: 'step1',
        run: ({ steps }) => {
          console.log('job2');
          return {
            result: 'job2',
          };
        },
      }),
  })
  .addJob({
    name: 'job3',
    job: job =>
      job
        .create()
        .needs('job1')
        .inputs({ projectPath: '/name' })
        .step({
          name: 'step1',
          run: ({ steps, needs }) => {

            // @ts-expect-error
            const result = needs.job1.outputs.name;

          },
        }),
  });
