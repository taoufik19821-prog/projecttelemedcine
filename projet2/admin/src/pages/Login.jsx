import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
const Login = () => {
  const [state, setState] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const {setAToken,backendUrl} = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)
  const navigate = useNavigate();

  const onSubmitHandler = async (event)=>{
      event.preventDefault()

      try{
          if(email === "" || password === ""){
            toast.error("Please fill all the fields")
            return
          }
          if(state === 'Admin'){
            
            const {data} = await axios.post('http://localhost:4000/api/admin/login',{email,password})
            
            if(data.success){
              localStorage.setItem('aToken',data.token)
              setAToken(data.token)
              navigate('/admin-dashboard')
              
            }else{
              toast.error(data.message)
            }
             
          }else{

            const {data} = await axios.post('http://localhost:4000/api/doctor/login',{email,password})
            if(data.success){
              localStorage.setItem('dToken',data.token)
              setDToken(data.token)
              console.log(data.token)
              navigate('/doctor-profile')
            }else{
              toast.error(data.message)
            }

          }

      }catch(error){
        console.error(error);


      }
  }



  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

        <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'> {state} </span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>

        <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'>Login</button>
        {
          state === 'Admin'
          ? <p>Doctor Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
          : <p>Admin Login? <span className='text-[#5F6FFF] underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
        }
      
      </div>
    </form>
  )
}

export default Login