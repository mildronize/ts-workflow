import { workflow } from '../main';
import { z } from 'zod';

export const prepare = workflow
  .job()
  .env(
    z.object({
      name: z.string(),
    })
  )
  .handler(({ env }) => {
    console.log(env.name);
    return {
      data: 'Hello World',
    };
  });
