import { TableRow, TableCell } from "@/components/ui/table"
import { feedbackModel } from "@/models/feedback/feedback"
import { Row, flexRender } from "@tanstack/react-table"
import { useState } from "react"
import ViewModal from "./viewFeedback"
import { RespondModal } from "./feedbackRespond"

type Props = {
   row: Row<feedbackModel>
}

const FeedbackRow = ({ row }: Props) => {

   const [respond, setRespond] = useState(false)
   const [view, setView] = useState(false)

   return (
      <>
         <TableRow
            onClick={() => setView(true)}
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
         >
            {row.getVisibleCells().map((cell) => (
               <TableCell
                  className={row.original.isRead ? 'text-muted-foreground' : ''}
                  key={cell.id}>
                  {flexRender(
                     cell.column.columnDef.cell,
                     cell.getContext()
                  )}
               </TableCell>
            ))}
         </TableRow>
         <ViewModal feedback={row.original} open={view} setModalOpen={setView} setRespondModal={setRespond} />
         <RespondModal id={row.original?.id} open={respond} setOpen={setRespond} />
      </>
   )
}

export default FeedbackRow