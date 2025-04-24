"use client"

import React from 'react'
import Input from '../components/Input'



function DoctorForm({projectInfo}) {

  return (
    <div className='bg-white w-full min-h-screen flex flex-col items-center'>
      <h1 className='text-2xl font-bold mt-'>BigViz</h1>
      <div className=''>
         <Input label="Doctor Name" placeholder="Enter Name "/>
      </div>
    </div>
  )
}

export default DoctorForm