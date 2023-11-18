import { workflow } from '../main';
import { z } from 'zod';

import helloWorldJob from './hello-world';

export default workflow
  .createJob('print')
  .need(helloWorldJob)
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
