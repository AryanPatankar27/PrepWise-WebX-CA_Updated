const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Define MCQ Result Schema
const mcqResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['topic', 'pdf'],
    required: true
  },
  topic: {
    type: String
  },
  pdfName: {
    type: String
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    userAnswer: {
      type: String
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MCQResult = mongoose.model('MCQResult', mcqResultSchema);

// POST - Save MCQ Result
router.post('/mcq-results', auth, async (req, res) => {
  try {
    const { 
      type, 
      topic, 
      pdfName, 
      questions, 
      score, 
      totalQuestions 
    } = req.body;

    // Create a new result
    const newResult = new MCQResult({
      userId: req.user.id,
      username: req.user.username,
      type,
      topic,
      pdfName,
      questions,
      score,
      totalQuestions,
      createdAt: new Date()
    });

    // Save to database
    await newResult.save();
    
    res.status(201).json({ 
      success: true, 
      message: "MCQ result saved successfully",
      result: newResult
    });
  } catch (error) {
    console.error('Error saving MCQ result:', error);
    res.status(500).json({ success: false, message: "Failed to save MCQ result", error: error.message });
  }
});

// GET - Fetch MCQ Results for a user
router.get('/mcq-results', auth, async (req, res) => {
  try {
    const results = await MCQResult.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching MCQ results:', error);
    res.status(500).json({ success: false, message: "Failed to fetch MCQ results", error: error.message });
  }
});

// GET - Fetch a specific MCQ Result by ID
router.get('/mcq-results/:id', auth, async (req, res) => {
  try {
    const result = await MCQResult.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "MCQ result not found" });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching MCQ result:', error);
    res.status(500).json({ success: false, message: "Failed to fetch MCQ result", error: error.message });
  }
});

module.exports = router; 