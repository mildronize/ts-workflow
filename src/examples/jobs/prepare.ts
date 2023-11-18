import { workflow } from '../main';
import { z } from 'zod';

export const prepare = workflow
  .job()
  .env(
    z.object({
      name: z.string(),
    })
  )
  .handler(({ env, pipeline }) =>
    pipeline
      .step({
        id: 'test',
        run: () => {
          console.log('step 1');
          return {
            data: 'test',
          };
        },
        postRun: ({ status }) => {
          if (status === 'failed') console.log('step 1');
        },
      })
      .step({
        run: ({ steps }) => {
          console.log(steps.test.outputs.data);
          console.log('step 2');
        },
      })
      .outputs(() => ({
        title: 'Hello World',
      }))
  );
