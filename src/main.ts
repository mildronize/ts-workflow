import { Workflow } from './libs';

async function main() {
  const workflow = new Workflow({
    postRun: {
      order: 'asc',
    },
  });

  const workflowOutput = await workflow
    .inputs({
      tenant: 'tenant',
    })
    .step({
      name: 'prepare',
      run: async ({ inputs, steps }) => {
        console.log('prepare');
        const result = inputs.tenant + ' prepare';
        return { result };
      },
      postRun: ({ status }) => {
        if (status === 'failed') {
          console.log();
        }
      },
    })
    .step({
      name: 'build',
      run: ({ inputs, steps }) => {
        const result = steps.prepare.outputs.result;
        console.log('build');
        const build = inputs.tenant + ' build';
        return { build };
      },
    })
    .step({
      name: 'deploy',
      run: ({ inputs, steps }) => {
        const result = steps.prepare.outputs.result;
        console.log('deploy');
        const deploy = result + ' deploy';
        return { deploy };
      },
    })
    .execute();

  console.log(workflowOutput);
}
main();
