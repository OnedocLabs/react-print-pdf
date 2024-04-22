import fs from 'fs';
import path from 'path';


export const replaceInFile = (filePath: string, search: string, replace: string) => {

  let fileContents = fs.readFileSync(filePath, 'utf8');

  // Find the location to insert at
  const insertLocation = fileContents.indexOf(search);

  // Check if the location was found
  if (insertLocation !== -1) {
    // Insert the new content
    const newContent = replace;
    fileContents = fileContents.replace(search,newContent);

    // Write the file back out
    fs.writeFileSync(filePath, fileContents);
  } else {
    console.log('Location not found');
  }

}