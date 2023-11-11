import { createWorkflow } from '../libs';

let workflow = createWorkflow({
  jobOptions: {
    postRun: {
      order: 'asc',
    },
  },
});

workflow
  .job({
    name: 'job1',
    job: w =>
      w
        .job()
        .inputs({ name: 'name' })
        .outputs(({ inputs }) => ({ name: inputs.name })),
  })
  .job({
    name: 'job2',
    needs: w => w.needs('job1'),
    job: w => w.job().inputs({ projectPath: '/name' }),
  })
  .job({
    name: 'job3',
    needs: w => w.needs('job1', 'job2'),
    job: w =>
      w
        .job()
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
