const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Importing models
const User = require('./models/User');
const Vote = require('./models/Vote');


const app = express();
const PORT = 3000


app.use(bodyParser.json());


mongoose.connect('<your_mongo_db_uri>', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


//Registration Route

app.post('/register', async (req, res) => {
    console.log('Register route hit');
    const { username, password } = req.body;
    

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
});

//Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token });
});

//Protect Routes with JWT Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

//Voting Route
app.post('/vote', authenticateJWT, async (req, res) => {
    const { candidate } = req.body;
    const newVote = new Vote({ candidate, userId: req.user.userId });
    await newVote.save();
    res.status(201).json({ message: 'Vote cast successfully' });
});

//Get Votes Route
app.get('/votes', authenticateJWT, async (req, res) => {
    const votes = await Vote.find().populate('userId', 'username');
    res.status(200).json(votes);
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});

//Voting Module Structure
const express = require('express');
const router = express.Router();

// Route to submit a vote
router.post('/vote', (req, res) => {
    // Logic to handle vote submission
});

// Route to tally votes
router.get('/tally', (req, res) => {
    // Logic to tally votes
});

module.exports = router;

// encryption module

const express = require('express');
const { encryptVote, decryptVote } = require('./quantumEncryption');
const app = express();

app.use(express.json());

// Route to submit a vote
app.post('/vote', (req, res) => {
    const { voteData } = req.body;
    
    // Encrypt the vote before storing
    const encryptedVote = encryptVote(voteData);

    // Store the encrypted vote on the blockchain
    // blockchain.storeVote(encryptedVote);

    res.send('Vote submitted successfully.');
});

// Route to tally votes
app.get('/tally', (req, res) => {
    // Fetch and decrypt votes
    // const decryptedVotes = blockchain.getVotes().map(decryptVote);

    // Tally the votes
    // const results = tallyVotes(decryptedVotes);

    res.json(results);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
