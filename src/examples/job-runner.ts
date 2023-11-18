import { OrderedPipeline } from '../ordered-pipeline';

function main() {
  const pipeline = new OrderedPipeline({
    postRun: {
      order: 'asc',
    },
  });
  pipeline
    .step({
      id: 'test',
      run: () => {
        console.log('step 1');
        return {
          data: 'test'
        }
      },
      postRun: ({ status }) => {
        if (status === 'failed') console.log('step 1');
      },
    })
    .step({
      run: ({ steps}) => {
        console.log(steps.test.outputs.data);
        console.log('step 2');
      },
    });
}
main();
