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
        // @ts-expect-error
        const reuslt = steps.prepare.outputs.result;
        console.log('build');
        const build = inputs.tenant + ' build';
        return { build };
      },
    })
    .execute();

  console.log(workflowOutput);
}
main();
