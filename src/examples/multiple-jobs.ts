import { createWorkflow } from '../libs';

let workflow = createWorkflow();

workflow.job({
  name: 'job1',
  job: workflow
    .createJob()
    .inputs({ name: 'name' })
    .outputs(({ inputs }) => ({ name: inputs.name })),
})
.job({
  name: 'job2',
  needs: w => w.needs('job1'),
  job: workflow.createJob().inputs({ projectPath: '/name' }),
});

const needs = ['job1', 'job2'];

function extractTypeList<const T extends string>(...args: T[]) {
  return args;
}

const needs2 = extractTypeList('job1', 'job2');
