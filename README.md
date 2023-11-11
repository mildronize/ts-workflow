# ts-workflows

> In Development

## Usage

```ts
import { Job } from '@ts-workflow/core';
// import { WorkflowGithubActions } from '@ts-workflow/github-actions'; TODO: Add Github Actions API

async function main() {
  const job = new Job({
    postRun: {
      order: 'asc',
    },
  });

  const JobOutput = await job
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

  console.log(JobOutput);
}
main();
```

```bash
# start
npm start
# Test watch mode
npm run test:watch
```
