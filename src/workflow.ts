import { Job } from "./job";

export class Workflow {
    job(name?: string) {
      return new Job(name);
    }
  }
  