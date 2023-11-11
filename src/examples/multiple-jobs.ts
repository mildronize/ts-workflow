import { createWorkflow } from '../libs';

let workflow = createWorkflow();

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
  });
