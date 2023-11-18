async function main() {
  /**
   * Test how to deal with dynamic imports
   */
  const jobs = await import('./jobs/hello-world');
  for (const job of Object.values(jobs)) {
    if (typeof job === 'object' && 'isExported' in job && job.isExported === true) {
      console.log(job);
    }
  }
}

main();
