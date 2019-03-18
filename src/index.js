const fs = require('fs')
const path = require('path')
const CLIEngine = require('eslint').CLIEngine

const promisfyWriteFile = function promisfyWriteFile(filePath, output, encoding) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, output, encoding, (err) => {
      if (err) return reject(err)
      resolve('autofixed')
    })
  })
}

const recursiveFiles = function recursiveFiles(files, dirname, pattern = /\.(js|jsx)$/) {
  let arr = fs.readdirSync(dirname)
  arr.forEach(_path => {
    const absPath = path.resolve(dirname, _path)
    const stat = fs.statSync(absPath)
    if (stat.isFile() && pattern.test(absPath)) {
      files.push(absPath)
    } else if (stat.isDirectory()) {
      recursiveFiles(files, absPath)
    }
  })
  return files
}

/**
 * 语法校验dir
 * @param {String} dir
 * @param {Regex} file
 * @param {Object} params
 */
function lintDir(dir, file = /\.(js|jsx)$/, { configFile }) {
  let files = []
  recursiveFiles(files, dir, file)

  const cli = new CLIEngine({
    fix: true,
    configFile: configFile || '.eslintrc',
    useEslintrc: true
  })

  const report = cli.executeOnFiles(files)

  const writeFilesPromises = report.results.map(item => {
    const { filePath, output } = item
    return output ? promisfyWriteFile(filePath, output, 'utf8') : Promise.resolve('no need')
  })

  return Promise.all(writeFilesPromises).then((done) => {
    console.log('done', done)
    return Promise.resolve(done)
  })
}

module.exports = lintDir
