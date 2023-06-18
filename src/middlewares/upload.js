const multer = require('multer');
const chalk = require('chalk');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    console.log(req);
    console.log(file);
    console.log(chalk.blue('yyyyy'));
    console.log(chalk.magenta('nnnnnnn'));
    cb(
      null,
      new Date().getTime() +
        '' +
        Math.round(Math.random() * 1000000000) +
        '.' +
        file.mimetype.split('/')[1]
    );
  },
});

module.exports = multer({ storage });
