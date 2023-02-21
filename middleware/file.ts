import fs from "fs";

const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

export default deleteFile;
