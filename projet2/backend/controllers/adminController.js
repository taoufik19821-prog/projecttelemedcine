import bcrypt from "bcrypt";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import Prediction from "../models/predictionModel.js";
import userModel from "../models/userModel.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const contractABI = require("../blockchain/contractABI.json");

// Load environment variables
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL);
const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, adminWallet);

const uploadToBlockchain = async (req, res) => {
  try {
      const { predictionId } = req.body;
      console.log("Fetching Prediction Data for ID:", predictionId);

      // Fetch Prediction from MongoDB
      const prediction = await Prediction.findById(predictionId).lean();
      if (!prediction) {
          console.error("Prediction not found for ID:", predictionId);
          return res.status(404).json({ success: false, message: "Prediction not found" });
      }

      // Check if already uploaded
      if (prediction.status === "uploaded") {
          console.warn("Prediction already uploaded:", predictionId);
          return res.status(400).json({ success: false, message: "Already uploaded to blockchain" });
      }

      const userId = prediction?.userData?.id ? prediction.userData.id.toString() : "0";
      console.log("User ID for blockchain:", userId);

      const probabilityInt = Math.round(prediction.probability * 10000);

      // Ensure contract is initialized
      if (!contract) {
          console.error("Smart contract not initialized");
          return res.status(500).json({ success: false, message: "Smart contract not initialized" });
      }

      let tx;
      try {
          console.log("Sending transaction to storePrediction...");
          tx = await contract.storePrediction(
              userId,
              prediction.disease,
              JSON.stringify(prediction.userData.inputs),
              prediction.predictionResult,
              probabilityInt
          );
          await tx.wait();
          console.log("Transaction successful! Hash:", tx.hash);
      } catch (error) {
          console.error("Transaction Failed:", error);
          return res.status(500).json({ success: false, message: `Blockchain transaction failed: ${error.message}` });
      }

      // Update MongoDB Status
      const updateResult = await Prediction.findByIdAndUpdate(predictionId, { status: "uploaded" });
      if (!updateResult) {
          console.error("Failed to update MongoDB for prediction:", predictionId);
          return res.status(500).json({ success: false, message: "Failed to update prediction status" });
      }
      console.log("MongoDB updated successfully for:", predictionId);

      res.json({ success: true, message: "Uploaded to blockchain", txHash: tx.hash });
  } catch (error) {
      console.error("Blockchain Upload Error:", error);
      res.status(500).json({ success: false, message: `Failed to upload to blockchain: ${error.message}` });
  }
};

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      ethAddress,
      experience,
      about,
      fees,
      address,
      
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !ethAddress
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
   // const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: null,
      password: hashedPassword,
      speciality,
      degree,
      ethAddress,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
      
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (
      email === "foulen31@gmail.com" &&
      password === "user19821"
    ) {console.log('________________________________');
      const token = jwt.sign(email + password, "eyJhbGciOiJIUzI1NiJ9.Zm91bGVuMzFnbWFpbC5jb211c2VyMTk4MjE.Xjha_U0PKGE1Td6qO6XWMViJ8mGzXD4-hA7d3Su8SeA");
      res.json({ success: true, token });
      console.log(token);
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get all-appointmet list

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to cancel appointment from admin
const cancelAppointmentAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get dashboard data for admin pannel

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Fetch all predictions
const getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({});
    res.json({ success: true, predictions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Assign doctor and update review status
const sendForReview = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const { predictionId } = req.params;

    console.log("Received predictionId:", predictionId);
    console.log("Received doctorId:", doctorId);

    // Check if the IDs are coming in
    if (!doctorId || !predictionId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Doctor ID and Prediction ID are required.",
        });
    }

    // Find the prediction
    const prediction = await Prediction.findById(predictionId);

    if (!prediction) {
      console.error("❌ Prediction not found for ID:", predictionId);
      return res
        .status(404)
        .json({ success: false, message: "Prediction not found." });
    }

    // Assign doctor and update status
    prediction.doctorId = doctorId;
    prediction.status = "reviewing";

    await prediction.save();

    console.log("✅ Prediction updated:", prediction);

    res
      .status(200)
      .json({
        success: true,
        message: "Doctor assigned and prediction sent for review.",
      });
  } catch (error) {
    console.error("🚨 Backend error:", error.message || error);
    res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` });
  }
};

const assignDoctorAndReview = async (req, res) => {
  const { predictionId, doctorId } = req.body;

  if (!predictionId || !doctorId) {
    return res.status(400).json({ error: "Missing prediction or doctor ID" });
  }

  try {
    const updatedPrediction = await Prediction.findByIdAndUpdate(
      predictionId,
      { doctorId, status: "reviewing" },
      { new: true }
    );

    if (!updatedPrediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    res.status(200).json(updatedPrediction);
  } catch (error) {
    console.error("Error assigning doctor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePrediction = async (req, res) => {
  try {
    const { predictionId } = req.params;

    // Find the prediction
    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }

    // Ensure it's rejected before deletion
    if (prediction.status !== "rejected") {
      return res.status(400).json({ success: false, message: "Only rejected predictions can be deleted." });
    }

    // Delete the prediction
    await Prediction.findByIdAndDelete(predictionId);
    res.json({ success: true, message: "Prediction deleted successfully." });
  } catch (error) {
    console.error("🚨 Error deleting prediction:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const handleDelete = async (req, res) => {
  try {
    const { predictionId } = req.params;

    // Find the prediction
    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }

    // Delete the prediction (without checking status)
    await Prediction.findByIdAndDelete(predictionId);
    res.json({ success: true, message: "Prediction deleted successfully." });
  } catch (error) {
    console.error("🚨 Error deleting prediction:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
export {
  addDoctor, adminDashboard, allDoctors,
  appointmentsAdmin, assignDoctorAndReview, cancelAppointmentAdmin, deletePrediction, getPredictions, handleDelete, loginAdmin, sendForReview, uploadToBlockchain
};

