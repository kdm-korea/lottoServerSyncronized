const path = require('path');
const dotenv = require('dotenv');

let envDir = '';

switch (process.env.NODE_ENV) {
  case 'product':
    envDir = '.product.env';
    break;
  case 'development':
    envDir = '.develop.env';
    break;
  case 'test':
    envDir = '.test.env';
    break;
  default:
    console.log(`❌ No have this name env ::: ${process.env.NODE_ENV}`);
}

dotenv.config({
  path: path.join(__dirname, '../env/', envDir),
});
