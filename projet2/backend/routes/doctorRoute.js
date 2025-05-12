
import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,editDocProfile,docProfile,getAssignedReviews,reviewPrediction} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,docProfile)
doctorRouter.post('/update-profile',authDoctor,editDocProfile)

doctorRouter.get('/predictions', authDoctor, getAssignedReviews);
doctorRouter.post('/review/:predictionId', authDoctor, reviewPrediction);

export default doctorRouter