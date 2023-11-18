import { workflow } from '../main';
import { z } from 'zod';
import helloWorld from './hello-world';
import prepare from './prepare';

export default workflow
  .createJob()
  .env(
    z.object({
      name: z.string(),
    })
  )
  .needs({
    helloWorld,
    prepare,
  })
  .handler(({ env, needs }) => {
    console.log(needs.helloWorld.outputs.title);
    console.log(needs.prepare.outputs.data);
    console.log(env.name);
    return {
      title: 'Hello World',
    };
  });
