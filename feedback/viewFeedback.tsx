import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { daysSince } from "@/lib/utils"
import { ObjectError } from "@/models/errorResponseModel"
import { feedbackModel } from "@/models/feedback/feedback"
import FeedbackApi from "@/store/services/feedBackApi"
import { TimerIcon } from "@radix-ui/react-icons"
import { Mail } from "lucide-react"
import { useEffect } from "react"

type Props = {
   feedback: feedbackModel,
   open: boolean,
   setRespondModal: React.Dispatch<React.SetStateAction<boolean>>,
   setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const ViewModal = ({ feedback: { content, createdAt, id, isRead, isResponded, subject, userId }, open, setModalOpen, setRespondModal }: Props) => {

   const [markAsRead, { isLoading, isSuccess, isError, error }] = FeedbackApi.useMarkAsReadMutation()

   const reply = () => {
      setModalOpen(false)
      setRespondModal(true)
   }

   useEffect(() => {
      if (isError) {
         let err = error as ObjectError
         if (err?.data?.errors) {
            toast({
               title: err?.data?.errors[0].description || "خطایی رخ داد",
               variant: "destructive",
               duration: 2000,
               dir: 'rtl',
               className: 'font-vazirmatn my-1'
            })
         }

      }

      if (isSuccess) {
         setModalOpen(false)
      }

   }, [isLoading])

   return (
      <>
         <Dialog open={open} onOpenChange={setModalOpen}>
            <DialogContent
               style={{ maxWidth: '45rem' }} dir='rtl' className={`sm:max-w-md overflow-y-auto font-vazirmatn text-right py-12 pb-0 px-8 h-full md:h-auto md:pt-16 md:pb-10`}>
               {
                  <div className='flex gap-x-8 flex-col md:flex-row'>
                     <div className='flex-1'>
                        <DialogHeader className='gap-y-5'>
                           <DialogTitle className='text-3xl text-right break-all'>{subject}</DialogTitle>
                           <DialogDescription className='text-right border-r-2 text-base rounded-lg  p-3 border-[#181818] pr-3 break-all whitespace-pre-line'>
                              {content}
                           </DialogDescription>
                        </DialogHeader>
                        <div className=' flex justify-start gap-x-5 my-4 text-muted-foreground text-[13px]'>
                           <span className='flex items-center'>
                              <span className=' ml-2'><TimerIcon /></span>
                              <span>
                                 <span className="h-2">
                                    {
                                       daysSince(createdAt)
                                    }
                                 </span>
                                 <span className="mr-4 ">
                                    {(new Date(createdAt)).toLocaleString() }
                                 </span>
                              </span>
                           </span>

                        </div>

                        <DialogFooter
                           className="sm:justify-start mt-12">
                           <div
                              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 gap-x-4 pb-2 pt-1">
                              <Button disabled={isLoading} onClick={reply} className={`${isResponded && 'hidden'}`} variant={'default'}>
                                 پاسخ
                              </Button>
                              <Button disabled={isLoading} onClick={() => markAsRead(id.toString())} className={`${isRead && 'hidden'}`} variant={'secondary'}>
                                 خواندن
                              </Button>
                              <Button className='' disabled={isLoading} onClick={() => { setModalOpen(false) }} variant={'secondary'}>
                                 برگشت
                              </Button>
                           </div>
                        </DialogFooter>
                     </div>
                  </div>
               }
            </DialogContent>
         </Dialog>
      </>
   )
}

export default ViewModal