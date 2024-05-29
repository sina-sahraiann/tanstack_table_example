import React from 'react'
import { DataTableDemo } from './feedbackList'

type Props = {}

const Ticket = (props: Props) => {
  return (
    <>
    <div className='sm:p-10 sm:pt-3 p-5'>
      <DataTableDemo/>
    </div>
    </>
  )
}

export default Ticket