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
    },
    updateLikes: async (reviewId, profileId, vote) => {
        const review = await Review.findOne({ _id: reviewId })
        const returnCount = Array.from(review.likes).length - Array.from(review.dislikes).length
        console.log(returnCount)

        if (vote === "like") {
            if (review.likes.includes(profileId)) {
                await Review.updateOne({ _id: review._id }, { $pull: { dislikes: profileId } })
                return returnCount
            }

            await Review.updateOne({ _id: review._id }, { $pull: { dislikes: profileId } })
            return returnCount + 1
        } else if (vote === "dislike") {
            if (review.dislikes.includes(profileId)) {
                await Review.updateOne({ _id: review._id }, { $pull: { likes: profileId } })
                return returnCount
            }

            await Review.updateOne({ _id: review._id }, { $push: { dislikes: profileId }, $pull: { likes: profileId } })
            return returnCount - 1
        }

        return returnCount
    }
}

module.exports = query
