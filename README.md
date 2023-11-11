# ts-workflows
Type-Safe Workflow Framework, inspired from Github Actions

> In Development, and Proof of concept process

The package offers a type-safe workflow framework designed in TypeScript, resembling the familiar experience of GitHub Actions. Its primary focus is on ensuring type confidence and providing a process that enables rollback functionalities using the postRun option.

## Key Features:

- **Rollback Capabilities**: The postRun option facilitates a rollback process, allowing for efficient handling of job failures.

- **Experimental Job Class**: The package currently introduces an experimental concept centered around the Job class. It aims to offer type safety and may potentially expand to support multiple interconnected jobs in the future, akin to GitHub-Actions' needs option.

## Purpose:

The package aims to enhance the reliability of workflow creation by emphasizing type safety, failure handling, and the potential for executing rollback procedures. It primarily caters to TypeScript users who seek maintainable pipelines, allowing for local testing to ensure smoother execution when deployed.



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


## Explanation
Provide an explanation of the example, demonstrating how to create a job, define steps, set inputs, and obtain outputs using the package.

### API
Detailed explanation of the package's API, including types and methods.

#### `Job<InputType, OutputType, StepType>`

**Constructor:**

`Job(option?: JobOption):` Initializes a new job instance with an optional postRun order.

**Methods:**

- `step(params: JobStepParams)`: Adds a step to the job with a given name and functionality.
- `inputs(value: InputType)`: Sets the input data for the job.
- `outputs(setOutput: JobStep)`: Sets the output based on the job steps.
- `execute()`: Executes the job with defined steps and inputs, returning the outputs upon completion.

## Contributing
Guide users on how they can contribute to the project, report issues, suggest improvements, or submit pull requests.

## License
MIT