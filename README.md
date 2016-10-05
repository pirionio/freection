# freection

## Migrate DB

We use the [rethink-migrate](https://github.com/JohanObrink/rethink-migrate) module.

### How to add a script

1. Run:
  
  ```
  npm install -g rethink-migrate
  ```
2. Run:

  ```
  rethink-migrate create [migrationName] --root db
  ```
  
3. Edit the newly created file as you wish.

### How to test locally

1. Delete the content of the file 'db/database.json'.
   
   *Explanation*: It holds SSL certificate, and is used only for production.

2. Run:

  ```
  npm run upgrade-db -- --db=test
  ```

**Notice!** Before committing, make sure the file 'db/database.json' is not committed!
