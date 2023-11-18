import { workflow } from '../main';
import { z } from 'zod';
import helloWorld from './hello-world';

export default workflow.createJob('print', {
  inputs: z.object({
    name: z.string(),
  }),
  needs: {
    helloWorld,
  },
  handler: ({ inputs, env, needs }) => {
    console.log(needs.helloWorld.outputs.title);
    console.log(inputs.name);
    console.log(env.HELLO);
    return {
      title: 'Hello World',
    };
  },
});
