import { Job } from './libs';

async function main() {
  const job = new Job({
    postRun: {
      order: 'asc',
    },
  });

  const jobOutput = await job
    .inputs({
      tenant: 'tenant',
    })
    .step({
      name: 'prepare',
      run: async ({ inputs }) => {
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
      run: ({ steps }) => {
        const result = steps.prepare.outputs.result;
        console.log('deploy');
        const deploy = result + ' deploy';
        return { deploy };
      },
    })
    .outputs(({ steps }) => {
      return {
        build: steps.build.outputs.build,
        deploy: steps.deploy.outputs.deploy,
      }
    })
    .execute();

  console.log(jobOutput);
}
main();
