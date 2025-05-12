import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>CONTACTE </p>
        </div>
        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
          <img className='w-full md:max-w-[360px]'src={assets.contact_image}alt="" />
          <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-lg text-gray-600'>Informations:</p>
            <p className='text-gray-500'>Goubaa Taoufik<br/>Rue djorf medenine 4100 ayati</p>
            <p className='text-gray-500'>Phone: +21699591665 <br/> Email: goubaa.taoufik@gmail.com</p>
            <p className='font-semibold text-lg text-gray-600'>CARRIÈRES DANS LE DOMAINE DE LA SANTÉ</p>
            <p className='text-gray-500'>En savoir plus sur nos équipes et nos offres d'emploi.</p>
            <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explorer les emplois</button>
          </div>
        </div>
    </div>
  )
}

export default Contact