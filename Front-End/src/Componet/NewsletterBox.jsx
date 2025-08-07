import React from 'react'

const NewsletterBox = () => {

  const onSubmitHandler = (event) => {
      event.preventDefault();
  }

    return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe and get 20% off</p>
      {/* Added 'break-words' to ensure long text content wraps within its container */}
      <p className='text-gray-400 mt-3 break-words'>
        Subscriber's are get more offer's and best servies.. 
        want to know what they get ? SUBSCRIBE konow
      </p>
      {/* Corrected 'sm:1/2' to 'sm:w-1/2' for proper Tailwind width application */}
      {/* The form width and centering should now behave as expected within the parent container */}
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        {/* Input is set to take full width and grow within the flex container */}
        <input className="w-full sm:flex-1 outline-none" type='email' placeholder='Enter your email' required/>
        <button type='submit' className='bg-green-600 text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
