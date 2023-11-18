import { workflow } from '../main';
import { helloWorld } from './hello-world';
import { prepare } from './prepare';

export const print = workflow
  .job()
  .env<{ name: string }>()
  .needs({
    helloWorld,
    prepare,
  })
  .handler(async ({ env, needs }) => {
    console.log(needs.helloWorld.outputs.title);
    console.log(needs.prepare.outputs.data);
    console.log(env.name);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
