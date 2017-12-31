var path = require('path')
var fs = require('fs')
var scriptPath = __dirname

var runPath = process.cwd()
var kontaktDir = path.join(scriptPath, 'kontakt-instruments')
var args = process.argv.slice(2)
var id = args[0]

function fromDir(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
        return
    }

    var files = fs.readdirSync(startPath)

    for (var i=0; i < files.length; i++) {
        var filename = path.join(startPath, files[i])
        var stat = fs.lstatSync(filename)

        if (stat.isDirectory()) {
            fromDir(filename, filter, callback) // recurse
        }
        else if (filter.test(filename)) {
            callback(filename)
        }
    }
}

var redir = { "redirect": id }
var redirStr = JSON.stringify(redir)

fromDir(runPath, /\.nki$/, function (file) {
    var filename = path.basename(file, '.nki')
    var outFile = path.join(kontaktDir, filename + '.json')

    if (!fs.existsSync(outFile)) {
        fs.writeFileSync(outFile, redirStr)
        console.log('Wrote ', filename + '.json')
    }
})
