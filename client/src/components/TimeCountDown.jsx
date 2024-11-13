import React from 'react'

const TimeCountDown = ({time}) => {

    const hours = time ? time.hours > 0 ? time.hours : 0 : 0;
    const minutes = time ? time.minutes > 0 ? time.minutes : 0 : 0;
    const seconds = time ? time.seconds > 0 ? time.seconds : 0 : 0;

    console.log({time})

  return (
    <>
          <div className="mb-6 text-center text-xl font-semibold">
            Time Left: {} {hours}h {minutes}m {seconds}s
          </div>
    </>
  )
}

export default TimeCountDown