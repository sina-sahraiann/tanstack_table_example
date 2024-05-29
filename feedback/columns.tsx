import {
   CaretSortIcon,
   DotsHorizontalIcon,
   CheckIcon} from "@radix-ui/react-icons"
import {
   ColumnDef,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { feedbackModel } from "@/models/feedback/feedback"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import ViewModal from "./viewFeedback"
import { RespondModal } from "./feedbackRespond"
import { daysSince } from "@/lib/utils"
import { displayFraction } from "./feedbackList"

export const columns: ColumnDef<feedbackModel>[] = [
   {
      accessorKey: "id",
      header: ({ column }) => {
         return (
            <div className="capitalize">شناسه</div>
         )
      },
      cell: ({ row }) => (
         <div className="capitalize ">{row.getValue("id")}</div>
      ),
   },
   {
      accessorKey: "subject",
      header: ({ column }) => {
         const [searchParams, setSearchParams] = useSearchParams();
         return (
            <Button
               variant="ghost"
               onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc")
                  if (searchParams.get('descending')) {
                     setSearchParams(searchParams => {
                        searchParams.delete('descending')
                        searchParams.delete('pageNumber')
                        return searchParams
                     })
                  }
               }}>
               موضوع
               <CaretSortIcon className="mr-2 h-4 w-4" />
            </Button>
         )
      },
      cell: ({ row }) =>
         <div className="lowercase">
            {displayFraction(row.getValue("subject"))}
         </div>,
   },
   {
      accessorKey: "content",
      header: ({ column }) => {
         const [searchParams, setSearchParams] = useSearchParams();
         return (
            <Button
               className="mr-auto"
               variant="ghost"
               onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc")
                  if (searchParams.get('descending')) {
                     setSearchParams(searchParams => {
                        searchParams.delete('descending')
                        searchParams.delete('pageNumber')
                        return searchParams
                     })
                  }
               }}            >
               متن
               <CaretSortIcon className="mr-2 h-4 w-4" />
            </Button>
         )
      },
      cell: ({ row }) =>
         <div className="lowercase">
            {displayFraction(row.getValue("content"))}
         </div>,
   },
   {
      accessorKey: "isRead",
      header: ({ column }) => {
         const [searchParams, setSearchParams] = useSearchParams();
         return (
            <span className="w-full flex justify-center">
               <Button
                  variant="ghost"
                  onClick={() => {
                     column.toggleSorting(column.getIsSorted() === "asc")
                     if (searchParams.get('descending')) {
                        setSearchParams(searchParams => {
                           searchParams.delete('descending')
                           searchParams.delete('pageNumber')
                           return searchParams
                        })
                     }
                  }}               >
                  خوانده شده
                  <CaretSortIcon className="mr-2 h-4 w-4" />
               </Button>
            </span>
         )
      },
      cell: ({ row }) => <div className="lowercase">{row?.getValue("isRead") ? <CheckIcon className="mx-auto text-center" /> : <span></span>}</div>,
   },
   {
      accessorKey: "isResponded",
      header: ({ column }) => {

         const [searchParams, setSearchParams] = useSearchParams();

         return (
            <span className="w-full flex justify-center">
               <Button
                  variant="ghost"
                  onClick={() => {
                     column.toggleSorting(column.getIsSorted() === "asc")
                     if (searchParams.get('descending')) {
                        setSearchParams(searchParams => {
                           searchParams.delete('descending')
                           searchParams.delete('pageNumber')
                           return searchParams
                        })
                     }
                  }}
               >
                  پاسخ داده شده
                  <CaretSortIcon className="mr-2 h-4 w-4" />
               </Button>
            </span>
         )
      },
      cell: ({ row }) => <div className="lowercase">{row?.getValue("isResponded") ? <CheckIcon className="mx-auto text-center" /> : <span></span>}</div>,
   },
   {
      accessorKey: "createdAt",
      header: ({ column }) => {
         const [searchParams, setSearchParams] = useSearchParams();
         const handlePage = (page: number) => {
            if (!(page === 1)) {
               setSearchParams(searchParams => {
                  setParam('pageNumber', page.toString())
                  return searchParams
               })
            } else {
               setSearchParams(searchParams => {
                  deleteParam('pageNumber')
                  return searchParams
               })
            }
         }

         const getParam = (key: string) => {
            return searchParams.get(key)
         }

         const deleteParam = (key: string) => {
            return searchParams.delete(key)
         }

         const setParam = (key: string, param: string) => {
            return searchParams.set(key, param)
         }

         const handleDescending = (sort: 'true' | 'false') => {
            handlePage(1)
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (sort === 'true') {
               setSearchParams(searchParams => {
                  setParam('descending', sort)
                  return searchParams
               })
            } else {
               setSearchParams(searchParams => {
                  deleteParam('descending')
                  return searchParams
               })
            }
         }

         return (
            <span className="w-full flex justify-center">
               <Button
                  variant="ghost"
                  onClick={() => {
                     column.toggleSorting(column.getIsSorted() === "asc")
                     handleDescending(getParam('descending') ? 'false' : 'true')
                  }}
               >
                  تاریخ
                  <CaretSortIcon className="mr-2 h-4 w-4" />
               </Button>
            </span>
         )
      },
      cell: ({ row }) => {
         const date = new Date(row.getValue("createdAt"))

         // Format the amount as a dollar amount


         return <div className=" text-center font-medium">{daysSince(row.getValue("createdAt"))}</div>
      },
   },
   {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {

         const [respond, setRespond] = useState(false)
         const [view, setView] = useState(false)

         const viewHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
            e.stopPropagation()
            setView(true)
         }

         const respondHadnler: React.MouseEventHandler<HTMLDivElement> = (e) => {
            e.stopPropagation()
            setRespond(true)
         }

         return (
            <>
               <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={viewHandler}>مشاهده</DropdownMenuItem>
                     {
                        !row.original.isResponded &&
                        <DropdownMenuItem onClick={respondHadnler}>پاسخ دادن</DropdownMenuItem>
                     }
                  </DropdownMenuContent>
               </DropdownMenu>
               <ViewModal feedback={row.original} open={view} setModalOpen={setView} setRespondModal={setRespond} />
               <RespondModal id={row.original?.id} open={respond} setOpen={setRespond} />
            </>
         )
      },
   },
]