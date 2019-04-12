const path = require('path');
const fs = require('fs');
const util = require('util');
const ora = require('ora')

const readFile = util.promisify(fs.readFile);
const removeFile = util.promisify(fs.unlink);
const fileExist = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

function buildComponent () {
    const loader = ora('Building Polymer project');
    const workfolder = process.cwd();
    const packageFilePath = path.join(workfolder, 'package.json');
    const indexFilePath = path.join(workfolder, 'index.html');

    loader.start()
    fileExist(indexFilePath)
    .then(() => removeFile(indexFilePath))
    .catch(() => '')
    .then(() => readFile(packageFilePath, 'utf8'))
    .then(value => {
        let packageObj = JSON.parse(value);
        let mainFilePath = path.join(workfolder, `${packageObj.name}.html`)

        return readFile(mainFilePath, 'utf8')
    })
    .then(value => {
        let indexContent = value.replace(/\.\/bower_components/gm,'..')
        
        return writeFile(indexFilePath, indexContent, 'utf8')
    })
    .then(() => {
        loader.succeed('Project built successfully');
    })
    .catch(error => { 
        loader.fail(`Error: ${error.message}`)
        throw error
    })
};

module.exports = {
    buildComponent
};
