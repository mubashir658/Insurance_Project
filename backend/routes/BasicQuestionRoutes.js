import express from 'express';
import BasicQuestion from '../models/BasicQuestion.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    console.log("Received form data:", JSON.stringify(req.body, null, 2));

    // Validate required fields
    const requiredFields = ['gender', 'area', 'qualification', 'income', 'vintage', 'claimAmount', 'numberOfPolicies', 'policiesChosen', 'policyType', 'maritalStatus'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create and save the document
    console.log("Attempting to create BasicQuestion document...");
    const basicQuestion = new BasicQuestion(req.body);
    
    console.log("Attempting to save to database...");
    await basicQuestion.save();
    
    console.log("Form data saved successfully:", {
      id: basicQuestion._id,
      timestamp: basicQuestion.createdAt
    });

    res.status(201).json({ 
      success: true, 
      message: 'Form data saved successfully',
      data: basicQuestion 
    });
  } catch (error) {
    console.error("Detailed error information:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });

    // Send more detailed error information to the client
    res.status(500).json({ 
      success: false, 
      message: error.message.includes("validation") 
        ? "Invalid form data" 
        : "Error saving form data",
      error: {
        name: error.name,
        message: error.message,
        validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        })) : null
      }
    });
  }
});

export default router; 