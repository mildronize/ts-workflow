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
      run: async ({ inputs }) => {
        console.log('prepare');
        const prepare = inputs.tenant + ' prepare';
        return { prepare };
      },
      postRun: ({ status }) => {
        if (status === 'failed') {
          console.log();
        }
      },
    })
    .step({
      name: 'build',
      run: ({ inputs }) => {
        console.log('build');
        const build = inputs.tenant + ' build';
        return { build };
      },
    })
    .execute();

  console.log(workflowOutput);
}
main();
