import { createWorkflow } from '../libs';

let workflow = createWorkflow({
  jobOptions: {
    postRun: {
      order: 'asc',
    },
  },
});

workflow
  .addJob('job1', {
    job: job =>
      job
        .create()
        .inputs({ name: 'name' })
        .outputs(({ inputs }) => ({ name: inputs.name })),
  })
  .addJob('job2', {
    needs: job => job.needs('job1'),
    job: job => job.create().inputs({ projectPath: '/name' }),
  })
  .addJob('job3', {
    needs: job => job.needs('job1', 'job2'),
    job: job =>
      job
        .create()
        .inputs({ projectPath: '/name' })
        .step({
          name: 'step1',
          run: ({ steps }) => {
            // @ts-expect-error
            const result = needs.job1.outputs.result;
            return { a: 1 };
          },
        }),
  });
