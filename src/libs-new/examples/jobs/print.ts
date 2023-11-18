import { workflow } from '../main';
import { z } from 'zod';
import helloWorld from './hello-world';
const data = helloWorld;
export default workflow
  .createJob('print')
  .need({
    helloWorld: import('./hello-world'),
  })
  .input(
    z.object({
      name: z.string(),
    })
  )
  .jobHandler({
    handler: ({ inputs, outputs, env, needs }) => {
      console.log(needs.helloWorld.outputs.message);
      console.log(inputs.name);
      console.log(env.HELLO);
      return {
        title: 'Hello World',
      };
    },
  });
