const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const app = express();
const Photo = require('./models/Photo');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');

//connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//template engine
app.set("view engine", "ejs");

//middlewares
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods:['POST', 'GET']
}));

//routes
app.get('/', async (req,res) => {
    const photos = await Photo.find({}).sort('-dateCreated');
    //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
    res.render('index', {
        photos
    });
})
app.get('/photos/:id', async (req,res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo
    })
})
app.get('/about', (req,res) => {
    res.render('about');
})
app.get('/add', (req,res) => {
    res.render('add');
})

app.post('/photos', async (req,res) => {
    const uploadDir = 'public/uploads';
    if(!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    let uploadedImage = req.files.image;
    let uploadedPath = __dirname + '/public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadedPath, async() => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadedImage.name
        });
        res.redirect('/');
    })
    
})

app.get('/photos/edit/:id', async (req,res) => {
    const photo = await Photo.findOne({_id: req.params.id})
    res.render('edit', {
        photo
    });
})

app.put('/photos/:id', async (req,res) => {
    const photo = await Photo.findOne({_id: req.params.id});
    photo.title = req.body.title;
    photo.description = req.body.description;
    await photo.save()
    res.redirect(`/photos/${req.params.id}`);
})

app.delete('/photos/:id', async (req,res) => {
    const photo = await Photo.findOne({_id: req.params.id});
    let deletedImage = __dirname + '/public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
})

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı..`);
})