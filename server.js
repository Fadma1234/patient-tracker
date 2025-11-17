const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(express.static(__dirname));



const patients = {
    'john doe': {
        'age': 45,
        'condition': 'Knee Replacement Recovery',
        'therapist': 'Dr. Alice Smith',
        'lastVisit': '2025-10-28',
        'progress': 'On track with exercises, minor stiffness.'
    },
    'jane smith': {
        'age': 32,
        'condition': 'Lower Back Pain',
        'therapist': 'Dr. Bob Johnson',
        'lastVisit': '2025-10-30',
        'progress': 'Improving range of motion, pain level decreasing.'
    },
    'unknown': {
        'age': 'N/A',
        'condition': 'Record not found',
        'therapist': 'N/A',
        'lastVisit': 'N/A',
        'progress': 'N/A'
    }
}

app.get('/', (request, response) => {
    response.render('index.ejs')
})

app.get('/login', (request, response) => {
    response.render('login.ejs', { message: '' })
})

app.get('/signup', (request, response) => {
    response.render('signup.ejs', { message: '' })
})

app.get('/profile', (request, response) => {
    response.render('profile.ejs', { message: '' })
})

app.get('/api/patient/:name', (request, response) => {
    const patientName = request.params.name.toLowerCase()

    if (patients[patientName]) {
        response.json(patients[patientName])
    } else {
        response.json(patients['unknown'])
    }
})
app.post('/signup', (req, res) => {
   
    res.send('Signup POST received!')
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`)
})
