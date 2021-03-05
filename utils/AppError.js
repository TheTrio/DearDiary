class AppError extends Error {
    constructor(name, status) {
        super()
        this.name = name
        this.status = status
    }
}

module.exports = AppError