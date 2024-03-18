const mongoose = require("mongoose")
const Profile = require("../database/models/Profile")
const Resto = require("../database/models/Resto")
const Review = require("../database/models/Review")
mongoose.connect("mongodb://localhost/ccapdev_ngolimko");

const query = {
    getProfile: async(filter) => {
        return await Profile.findOne(filter).lean()
    },
    getResto: async(filter) => {
        return await Resto.findOne(filter).lean()
    },
    getRestos: async(filter) => {
        return await Resto.find(filter).lean()
    },
    getReviews: async(filter) => {
        return await Review.find(filter)
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
    }
}

module.exports = query
