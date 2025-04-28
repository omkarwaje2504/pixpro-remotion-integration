"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from '../components/FileUpload'
import Input from '@components/Input';
import AudioRecorder from '@components/Recorder'

const DoctorForm = ({projectInfo}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    photo: null,
    document: null,
    movie: '',
    slot: '',
    prize: '',
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  return (
    <StyledWrapper className='flex justify-center items-center h-screen px-2 bg-black'>
      <div className="form-container" style={{
        background: `linear-gradient(${projectInfo?.formgradient || "#212121"}, ${projectInfo?.formgradient || "#212121"}) padding-box, linear-gradient(145deg, transparent 35%, ${projectInfo?.fromColor || "#e81cff"}, ${projectInfo?.toColor || "#40c9ff"}) border-box`,
        border: '2px solid transparent',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}>
        <h1 className='text-xl text-[#9b9898]'>BigViz Doctor Form</h1>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <div className="form-group">
                <Input label="Doctor Name" placeholder="Enter Doctor Name" type='text' required={true}/>
              </div>
              <div className="form-group">
                <Input label="Doctor Mobile" placeholder="Enter Doctor Mobile" type='number' required={true}/>
              </div>
              {/* {console.log(projectInfo.fields.speciality)} */}
              {
                Object.values(projectInfo.fields).map((field,index)=>(
                  <div className="form-group">
                    <Input label={field.label} placeholder={field.placeholder} type={field.type} required={field?.validations?.required}/>
                  </div>
                ))
              }
            </>
          )}

          {step === 2 && (
            <>
              <FileUpload/>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <AudioRecorder/>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="form-group">
                <label className='text-white/70'>Select Movie</label>
                <input type="text" name="movie" value={formData.movie} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className='text-white/70'>Select Time Slot</label>
                <input type="text" name="slot" value={formData.slot} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className='text-white/70'>Prize</label>
                <input type="text" name="prize" value={formData.prize} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <button type="button" className="form-submit-btn" onClick={handleBack}>
                Back
              </button>
            )}
            {step < 4 ? (
              <button type="button" className="form-submit-btn" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="form-submit-btn">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  .form-container {
    width: 400px;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
    background-size: 200% 100%;
    animation: gradient 5s ease infinite;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-container .form-group label {
    display: block;
    margin-bottom: 5px;
    
    font-weight: 600;
    
  }

  .form-container .form-group input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #414141;
  }

  .form-container .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    resize: none;
    color: #fff;
    height: 96px;
    border: 1px solid #414141;
    background-color: transparent;
    font-family: inherit;
  }

  .form-container .form-group input::placeholder {
    opacity: 0.5;
  }

  .form-container .form-group input:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-group textarea:focus {
    outline: none;
    border-color: #e81cff;
  }

  .form-container .form-submit-btn {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    align-self: flex-start;
    font-family: inherit;
    color: #717171;
    font-weight: 600;
    width: 40%;
    background: #313131;
    border: 1px solid #414141;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
  }

  .form-container .form-submit-btn:hover {
    background-color: #fff;
    border-color: #fff;
  }`;

export default DoctorForm;
