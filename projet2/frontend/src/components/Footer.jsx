import React from 'react'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
           

            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>CONTACT:</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Phone:+21699591665</li>
                    <li>Email:goubaa.taoufik@gmail.com</li>
                    
                    <li>HEALTHCARE</li>
                </ul>
            </div>
        </div>
        <div>
            <hr className='border-gray-400'/>
            <p className='py-5 text-sm text-center'>Copyright © 2025 HEALTHCARE- All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer