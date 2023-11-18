import { workflow } from '../main';
import { z } from 'zod';

export default workflow
  .job()
  .env(
    z.object({
      name: z.string(),
    })
  )
  .handler(({ env }) => {
    console.log(env.name);
    return {
      title: 'Hello World',
    };
  });
