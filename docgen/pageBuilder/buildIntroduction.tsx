import fs from 'fs';
import path from 'path';


export const replaceInFile = (filePath: string, search: RegExp, replace: string) => {

  let fileContents = fs.readFileSync(filePath, 'utf8');

  if (search.test(fileContents)) {
    // Replace the pattern with the new content
    fileContents = fileContents.replace(search, replace);

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContents);
    console.log('Replacement successful');
  } else {
    console.log('Pattern not found');
  }

}