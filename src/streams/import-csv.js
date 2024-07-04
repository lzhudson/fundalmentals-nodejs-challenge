import fs from 'node:fs';
import { parse } from 'csv-parse';

const __dirname = new URL('.', import.meta.url).pathname;

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/tasks.csv`)
    .pipe(parse({
    }));
  let i = 0;
  for await (const record of parser) {
    if(i > 0) {
      const [title, description] = record;
      const response = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description
        })
      });
      records.push(record);
    }
    i++;
  }
  return records;
};

(async () => {
  await processFile();
})();