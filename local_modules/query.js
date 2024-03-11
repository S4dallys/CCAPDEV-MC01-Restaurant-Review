const mongoose = require("mongoose")
const Profile = require("../database/models/Profile")
const Resto = require("../database/models/Resto")
const Review = require("../database/models/Review")
mongoose.connect("mongodb://localhost/ccapdev");

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
        Review.create({
            restoId: data.restoId,
            profileId: data.profileId,
            title: data.title,
            body: data.body,
            uploads: data.uploads,
            lastUpdated: data.lastUpdated,
            stars: data.stars,
        })
    }
}

module.exports = query
