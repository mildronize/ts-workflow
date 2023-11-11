# ts-workflows

> In Development

## Expected Usage

```ts

const workflow = new Workflow({
  postRun: {
    order: 'asc'
  }
});

const workflowOutput = await workflow
  .input({
    env: 123,
    tenant: 'tenant',
  })
  .step({
    name: 'prepare',
    run: async ({ env, tenant }) => {
      console.log('prepare');
      const prepare = 'data';
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
    run: ({ prepare, env, tenant }) => {
      console.log('build');
      const build = prepare + ' build';
      return { build };
    },
  })
  .execute();

console.log(workflowOutput);
```

```bash
# start
npm start
# Test watch mode
npm run test:watch
```
