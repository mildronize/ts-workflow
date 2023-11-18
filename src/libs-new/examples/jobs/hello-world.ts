import { workflow } from '../main';
import { z } from 'zod';

export default workflow.createJob('helloWorld', {
  inputs: z.object({
    name: z.string(),
  }),
  handler: ({ inputs, env, needs }) => {
    // console.log(needs.helloWorld.outputs.message);
    console.log(inputs.name);
    console.log(env.HELLO);
    return {
      title: 'Hello World',
    };
  },
});
