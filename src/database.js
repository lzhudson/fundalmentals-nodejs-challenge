import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {}


  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }
  findById(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    return this.#database[table][rowIndex];
  }
  select(table, search) {
    let data = this.#database[table] ?? []
    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        })
      })
    }
    
    return data
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data
  }
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = { 
        ...this.#database[table][rowIndex], 
        title: data.title ? data.title : this.#database[table][rowIndex].title,
        description: data.description ? data.description : this.#database[table][rowIndex].description,
        updated_at: new Date(),
        completed_at: data.completed_at ? data.completed_at : this.#database[table][rowIndex].completed_at,
      }
      this.#persist();
    }
  }
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}