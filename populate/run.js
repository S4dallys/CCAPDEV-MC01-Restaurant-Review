const mongoose = require('mongoose');
const path = require("path")
const fs = require('fs');
const { ObjectId } = mongoose.Types;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URL);

// Load JSON files
const profilesData = JSON.parse(fs.readFileSync(__dirname + '/profiles.json', 'utf-8'));
const restosData = JSON.parse(fs.readFileSync(__dirname + '/restos.json', 'utf-8'));
const reviewsData = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8')); 

// Function to convert string _id to ObjectId in an array of objects
function convertIdsToObjectId(data) {
    return data.map(item => {
        if (item._id) {
            item._id = new ObjectId(item._id);
        }

        if (item.restoId) {
            item.restoId = new ObjectId(item.restoId);
        }

        if (item.profileId) {
            item.profileId = new ObjectId(item.profileId);
        }

        return item;
    });
}

// Convert string _ids to ObjectId in each data set
const profiles = convertIdsToObjectId(profilesData);
const restos = convertIdsToObjectId(restosData);
const reviews = convertIdsToObjectId(reviewsData);

// Define Mongoose models for Profile, Resto, and Review
const Profile = require("../database/models/Profile")
const Resto = require("../database/models/Resto")
const Review = require("../database/models/Review")

async function deleteAllEntries() {
    await Profile.deleteMany({});
    await Resto.deleteMany({});
    await Review.deleteMany({});
}

// Function to insert data into the database
async function insertData() {
    await deleteAllEntries()
    await Profile.insertMany(profiles);
    await Resto.insertMany(restos);
    await Review.insertMany(reviews);
}

// Execute the function to insert data
insertData().then(() => {
    console.log('Data inserted successfully.');
    mongoose.connection.close();
}).catch(err => {
    console.error('Error inserting data:', err);
    mongoose.connection.close();
});


