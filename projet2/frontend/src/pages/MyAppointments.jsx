import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, user } = useContext(AppContext);
  const navigate = useNavigate();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split('_');
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  const [appointments, setAppointments] = useState([]);

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { token } }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200'>
        Mes Rendez-vous:
      </p>
      <div>
        {appointments.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-[1fr_2fr_1fr] gap-4 py-2 border-b border-gray-200 items-center'
          >
            <div className='text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-zinc-700 font-medium mt-1'>Wallet:</p>
              <p className='text-xs'>{item.docData.ethAddress}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>
                  Date & Time:
                </span>{' '}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className='flex flex-col gap-2 justify-end'>
              {/* Visite en ligne */}
              {item.payment && !item.cancelled && (
                <button
                  onClick={() => navigate('/virtual-visit', {
                    state: {
                      appointmentId: item._id,
                      patient: user?.name || item.userData?.name || 'Patient',
                      docteur: item.docData.name,
                      Useremail:user?.email || item.userData?.email,
                      Emaildocteur:item.docData.email,  
                    }
                  })}
                  className='sm:min-w-48 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
                >
                  Visite en ligne
                </button>
              )}

              {/* Paid status */}
              {item.payment && !item.cancelled && !item.isCompleted && (
                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                  Paid
                </button>
              )}

              {/* Pay Online button */}
              {!item.payment && !item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => navigate('/payment', {
                    state: {
                      appointmentId: item._id,
                      patient: user?.name || item.userData?.name || 'Patient',
                      docteur: item.docData.name,
                      docteurAddr: item.docData.ethAddress,
                      docteurfrais: item.docData.fees
                      
                    }
                  })}
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-gray-200 rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300'
                >
                  Pay Online
                </button>
              )}

              {/* Cancel Appointment */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-gray-200 rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                >
                  Cancel Appointment
                </button>
              )}

              {/* Cancelled status */}
              {item.cancelled && !item.isCompleted && (
                <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                  Appointment Cancelled
                </button>
              )}

              {/* Completed status */}
              {item.isCompleted && (
                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
