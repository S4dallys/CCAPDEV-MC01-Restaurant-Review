const mongoose = require("mongoose")
const Profile = require("../database/models/Profile")
const Resto = require("../database/models/Resto")
const Review = require("../database/models/Review")
mongoose.connect("mongodb://localhost/ccapdev_ngolimko");

const query = {
    getProfile: (filter) => {
        return Profile.findOne(filter).lean()
    },
    getResto: (filter) => {
        return Resto.findOne(filter).lean()
    },
    getRestos: (filter = {}) => {
        return Resto.find(filter).lean()
    },
    getReviews: (filter) => {
        return Review.find(filter)
            .populate({
                path: 'restoId',
                model: 'Resto'  
            })
            .populate({
                path: 'profileId',
                model: 'Profile'  
            })
            .lean()
    },
    insertReview: (data) => {
        return Review.create({
            ...data
        })
    },
    insertProfle: (data) => {
        return Profile.create({
            ...data
        })
    },
    updateProfile: (field, set) => {
        return Profile.updateOne(field, set)
    }
}

module.exports = query
