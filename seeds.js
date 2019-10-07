var   mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment");

var data = [
    {
        name: "Starry Forest",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Eros donec ac odio tempor orci. Volutpat lacus laoreet non curabitur gravida. Rutrum quisque non tellus orci ac auctor. Cras tincidunt lobortis feugiat vivamus at augue eget arcu. Diam volutpat commodo sed egestas. Malesuada fames ac turpis egestas sed tempus urna et. Rhoncus aenean vel elit scelerisque mauris pellentesque. Imperdiet nulla malesuada pellentesque elit eget gravida cum sociis. Nisl pretium fusce id velit ut. Tellus rutrum tellus pellentesque eu. Proin nibh nisl condimentum id venenatis a condimentum vitae sapien. Vitae tempus quam pellentesque nec. Urna molestie at elementum eu facilisis. Blandit volutpat maecenas volutpat blandit aliquam etiam. Dapibus ultrices in iaculis nunc sed. Egestas sed sed risus pretium quam vulputate. A diam sollicitudin tempor id eu nisl. Nec tincidunt praesent semper feugiat nibh sed. Malesuada nunc vel risus commodo viverra maecenas accumsan."
    },
    {
        name: "Moutain lake",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Elit duis tristique sollicitudin nibh. Aliquam malesuada bibendum arcu vitae. At varius vel pharetra vel turpis nunc eget lorem. Iaculis eu non diam phasellus vestibulum lorem sed risus ultricies. Tellus cras adipiscing enim eu turpis egestas pretium aenean. Posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus. Felis eget nunc lobortis mattis aliquam faucibus purus in massa. Sit amet justo donec enim. Risus at ultrices mi tempus imperdiet. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Tortor condimentum lacinia quis vel eros."
    },
    {
        name: "Aspen forest",
        image: "https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Elit scelerisque mauris pellentesque pulvinar. Et malesuada fames ac turpis egestas. Ac turpis egestas maecenas pharetra convallis posuere morbi leo. In aliquam sem fringilla ut morbi. Arcu odio ut sem nulla pharetra. Nunc pulvinar sapien et ligula ullamcorper malesuada proin. Amet mattis vulputate enim nulla aliquet porttitor lacus. Lacus sed viverra tellus in hac. Leo duis ut diam quam nulla porttitor massa id neque. Diam phasellus vestibulum lorem sed risus."
    },
]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed campgrounds.");
    //Remove all comments
        Comment.deleteMany({}, (err) => {
            if(err) {
                console.log(err);
            }
            console.log("Removed comments.");
    //Add a few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a campground!");
                    Comment.create({
                        text: "This place is great, but I wish there was wifi :(",
                        author: "Jess"
                    }, (err, comment) => {
                        if(err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment!");
                        };
                    });
                };
            });
        });    
    });
    });
};
module.exports = seedDB;
