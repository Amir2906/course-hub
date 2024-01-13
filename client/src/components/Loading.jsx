const Spinner = () => {
    return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'>
        <div className='w-16 h-16 rounded-full bg-sky-600 animate-ping'></div>
      </div>
    )
  }
  
  export default Spinner  