var  mongoose = require("mongoose");
var  Comment  = require("./comment");

//Create new blueprint and useable model for database // 
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

campgroundSchema.pre("remove", async function(next) {
    try {
        await Comment.deleteMany({
            "_id": {
               $in: this.comments 
            }
        });
        next();
    } catch (err) {
        next(err);
    }

});

module.exports = mongoose.model("Campground", campgroundSchema);
