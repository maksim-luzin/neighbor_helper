module.exports = {
    errorFile: {
        level: 'error',
        name: 'file.error',
        filename: `${__dirname}/../logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 10 * 1024 * 1024,
        maxFiles: 100,
        colorize: true
    }
}
