const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware

app.use(bodyParser.json());

// MongoDB Connection URI (your provided MongoDB connection string)
const MONGODB_URI = 'mongodb+srv://amankhan19989270mi:brUJ2PMcSG5xOKzM@cluster0.mpzmstn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define Feedback Schema using Mongoose
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Route to submit feedback (POST)
app.post('/api/submit-feedback', async (req, res) => {
  const { name, email, message } = req.body;

  // Simple validation
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required');
  }

  try {
    const feedback = new Feedback({
      name,
      email,
      message,
    });
    await feedback.save();
    res.status(200).send('Feedback submitted successfully');
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).send('Internal server error');
  }
});

// Route to get all feedbacks (GET)
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).send('Internal server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
