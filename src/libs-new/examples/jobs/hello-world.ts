import { workflow } from '../main';
import { z } from 'zod';


export default workflow
  .createJob('helloWorld')
  .input(
    z.object({
      name: z.string(),
    })
  )
  .jobHandler(({ inputs, outputs, env, needs }) => {
    // @ts-expect-error
    const result = needs.helloWorld.outputs.title;
    outputs.message = `Hello ${inputs.name}!`;
    env.HELLO = 'WORLD';
    return {
      title: 'Hello World',
    };
  });
