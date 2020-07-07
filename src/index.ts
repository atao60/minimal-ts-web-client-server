import { someFunction } from './other_module';

document.addEventListener('DOMContentLoaded', (_event) => {
  console.log("Callback of DOMContentLoaded: never called as allways loaded after DOMContentLoaded!")
  someFunction();
});

someFunction();