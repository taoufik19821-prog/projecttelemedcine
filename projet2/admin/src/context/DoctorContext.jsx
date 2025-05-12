import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

    const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken,setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
    const [profileData,setProfileData] = useState(false)
    const [assignedPredictions, setAssignedPredictions] = useState([]);
    const getAppointments=async()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/appointments',{headers:{dToken}})
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const demiAppointment = async (appointmentId,tarif)=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/doctor/demi-appointment',{appointmentId},tarif,{headers:{dToken}})
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDashData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{dToken}})
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getProfileData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/profile',{headers:{dToken}})
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getAssignedReviews = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/predictions', { headers: { dToken } });
            if (data.success) {
                setAssignedPredictions(data.predictions);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const reviewPrediction = async (predictionId, status) => {
        try {
            const { data } = await axios.post(
                backendUrl + `/api/doctor/review/${predictionId}`,
                { status },
                { headers: { dToken } }
            );
    
            if (data.success) {
                // toast.success(data.message);
                getAssignedReviews(); // Refresh after action
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };        
    const value = {
        dToken,setDToken,
        backendUrl,
        appointments,setAppointments,
        getAppointments,
        completeAppointment,
        demiAppointment,
        cancelAppointment,
        dashData,setDashData,
        getDashData,
        profileData,setProfileData,
        getProfileData,
        assignedPredictions, setAssignedPredictions, getAssignedReviews, reviewPrediction,
    }

    return (
        <DoctorContext.Provider value = {value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider