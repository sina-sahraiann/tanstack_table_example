import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import FeedbackApi from "@/store/services/feedBackApi"
import { ObjectError } from "@/models/errorResponseModel"
import { toast } from "@/components/ui/use-toast"

interface Props {
   open: boolean,
   setOpen: React.Dispatch<React.SetStateAction<boolean>>,
   id: number,
}

export function ReplyForm({id,setOpen,open}: Props) {

   const formSchema = z.object({
      content: z.string().min(5, { message: "Content should have at least 5 characters" }),
   });

   const [snedRespond, { isLoading, isSuccess, isError, error }] = FeedbackApi.useCreateFeedbackResponseMutation()


   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         content: '',
      },
   })

    function onSubmit(values: z.infer<typeof formSchema>) {
       snedRespond({...values, feedbackId : id})
   }

   React.useEffect(() => {
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
         setOpen(false)
      }

   }, [isLoading])


   return (

      <ScrollArea>
         <Form {...form}>
            <form dir="rtl" onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-3 p-1 mt-3")}>

               <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>متن پاسخ</FormLabel>
                        <FormControl>
                           <Textarea
                           rows={5}
                              dir="auto"
                              className="resize-none"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button disabled={!form.formState.isValid || isLoading} className="mt-3" type="submit">پاسخ دادن</Button>
            </form>
         </Form>
      </ScrollArea>

   )
}
