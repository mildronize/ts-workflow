import { workflow } from '../main';
import { z } from 'zod';

export default workflow
  .createJob('helloWorld')
  .input(
    z.object({
      name: z.string(),
    })
  )
  //   .jobHandler({
  //     handler: ({ inputs, outputs, env, needs }) => {
  //       console.log(needs.helloWorld.outputs.message);
  //       console.log(inputs.name);
  //       console.log(env.HELLO);
  //       return {
  //         title: 'Hello World',
  //       };
  //     },
  //   });
  .jobHandler2(({ inputs, outputs, env, needs }) => {
    // console.log(needs.helloWorld.outputs.message);
    console.log(inputs.name);
    console.log(env.HELLO);
    return {
      title: 'Hello World',
    };
  });
