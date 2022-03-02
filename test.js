const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//create schema
const photoSchema = new Schema({
    title: String,
    description: String
})

const Photo = mongoose.model('photo', photoSchema)

/*
Photo.create({
    title: 'Photo Title 2',
    description: 'Photo deneme2'
})
*/
/*
Photo.find({}, (err, data) => {
    console.log(data);
});
*/
/*
const id = "621d0ed05942af4538eff138";
Photo.findByIdAndUpdate(
    id, {
        title: "Photo 2 title Updated",
        description: "Photo description 3 Updated"
    },
    {
        new: true
    },
    (err, data) => {
        console.log(data);
    }
);
*/
/*
const id = "621d0ed05942af4538eff138";
Photo.findByIdAndRemove(id, (err, data) => {
    console.log(`ID ${id} veri silindi`);
});
*/