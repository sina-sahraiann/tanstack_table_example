import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer"
import { ReplyForm } from "./respondForm";

interface Props {
   open: boolean,
   setOpen: React.Dispatch<React.SetStateAction<boolean>>,
   id: number,
}

export function RespondModal({ open, setOpen, id }: Props) {

   const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

   if (!isSmallDevice) {
      return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent dir="rtl" className="sm:max-w-[425px] text-right">
               <DialogHeader className="">
                  <DialogTitle className="text-right">پاسخ به پیام</DialogTitle>
                  <DialogDescription className="text-right">
                     برای پاسخ دادن به پیام فرم زیر را پر کنید
                  </DialogDescription>
               </DialogHeader>
               <ReplyForm open={open} setOpen={setOpen} id={id} />
            </DialogContent>
         </Dialog>
      )
   }

   return (
      <Drawer open={open} onOpenChange={setOpen}>
         <DrawerContent dir="rtl" className=" p-3 pt-5 pb-6">
            <DrawerHeader className="text-right">
               <DrawerTitle className="text-right">پاسخ به پیام</DrawerTitle>
               <DrawerDescription className="text-right">
                  برای پاسخ دادن به پیام فرم زیر را پر کنید
               </DrawerDescription>
            </DrawerHeader>
            <ReplyForm open={open} setOpen={setOpen} id={id} />
         </DrawerContent>
      </Drawer>
   )
}