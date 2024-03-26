const error = {
    throwProfileError: () => {
        throw { name: "ProfileError", message: "Profile not found." }
    },
    throwRestoError: () => {
        throw { name: "RestoError", message: "Resto not found." }
    },
    throwReviewFetchError: () => {
        throw { name: "ReviewFetchError", message: "Reviews could not be fetched." }
    },
    throwRestoFetchError: () => {
        throw { name: "RestoFetchError", message: "Restos could not be fetched." }
    },
    throwLoginError: () => {
        throw { name: "LoginError", message: "Login details could not be found." }
    },
    throwLoginFailError: () => {
        throw { name: "LoginFailError", message: "Failed to login, please retry!" }
    },
    throwRegisterFailError: () => {
        throw { name: "RegisterFailError", message: "Failed to register, please retry!" }
    },
    getUnknownError: () => {
        return { name: "UnknownError", message: "An unknown error occured." }
    },
    getInsertError: () => {
        return { name: "InsertError", message: "Could not create review." }
    }
}

module.exports = error
