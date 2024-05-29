import {
   ChevronDownIcon,
   MixerHorizontalIcon
} from "@radix-ui/react-icons"
import {
   ColumnFiltersState,
   SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getSortedRowModel,
   useReactTable,
} from "@tanstack/react-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { feedbackModel } from "@/models/feedback/feedback"
import { useSearchParams } from "react-router-dom"
import { useDebounce } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import FeedbackApi from "@/store/services/feedBackApi"
import EmptyState from "@/components/ui/emptyState"
import FeedbackRow from "./feedbackRow"

const persianHeaders = {
   id: 'شناسه',
   subject: 'موضوع',
   content: 'متن',
   isRead: 'خوانده شده',
   isResponded: 'پاسخ داده شده',
   createdAt: 'تاریخ'
}

export const displayFraction = (text: any) => {
   return (
      <>
         {text.substring(0, 20)}
         {text.length > 20 && ' ...'}
      </>
   )
}

export function DataTableDemo() {

   const getParam = (key: string) => {
      return searchParams.get(key)
   }

   const deleteParam = (key: string) => {
      return searchParams.delete(key)
   }

   const setParam = (key: string, param: string) => {
      return searchParams.set(key, param)
   }

   const [sorting, setSorting] = useState<SortingState>([])
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
      []
   )
   const [columnVisibility, setColumnVisibility] =
      useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = useState({})
   const [searchParams, setSearchParams] = useSearchParams();
   const [searchWords, setSearchWords] = useState(getParam('search') || '')
   const debouncedSearchTerm = useDebounce(searchWords, 400)

   const {
      data: feedbacks = { feedbacks: [], numberOfPages: 1 },
      refetch,
      isSuccess
   } = FeedbackApi.useGetFeedbacksQuery({
      pageNumber: Number(getParam('pageNumber') || '1'),
      sortBy: 'createdAt',
      descending: !getParam('descending') ? true : false,
      searchKeyword: getParam('search') || '',
      isRead: Number(getParam('isRead') || '2'),
      isResponded: Number(getParam('isResponded') || '2'),
   });

   useEffect(() => {
      refetch();
   }, [searchParams, searchParams?.get('descending'), refetch]);

   useEffect(() => {
      handleSearch(debouncedSearchTerm)
   },
      [debouncedSearchTerm])

   const handleSearch = (searchTerm: string) => {
      handlePage(1)
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (searchTerm) {
         setSearchParams(searchParams => {
            setParam('search', searchTerm)
            return searchParams
         })
      } else {
         setSearchParams(searchParams => {
            deleteParam('search')
            return searchParams
         })
      }
   }

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

   const isReadStates: { state: '0' | '1' | '2', text: string }[] = [
      { state: '0', text: 'خوانده نشده' },
      { state: '1', text: 'خوانده شده' },
      { state: '2', text: 'همه' }
   ]

   const isRespondedStates: {
      state: '0' | '1' | '2', text: string
   }[] = [
         { state: '0', text: 'پاسخ داده نشده' },
         { state: '1', text: 'پاسخ داده شده' },
         { state: '2', text: 'همه' }
      ]

   const handleIsRead = (state: '0' | '1' | '2') => {
      handlePage(1)
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (!(state === "2")) {
         setSearchParams(searchParams => {
            searchParams.set('isRead', state)
            return searchParams
         })
      } else {
         setSearchParams(searchParams => {
            searchParams.delete('isRead')
            return searchParams
         })
      }
   }

   const handleIsResponded = (state: '0' | '1' | '2') => {
      handlePage(1)
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (!(state === "2")) {
         setSearchParams(searchParams => {
            searchParams.set('isResponded', state)
            return searchParams
         })
      } else {
         setSearchParams(searchParams => {
            searchParams.delete('isResponded')
            return searchParams
         })
      }
   }

   const resetFilter = () => {
      setSearchWords('')
      setSearchParams(searchParams => {
         deleteParam('isRead')
         deleteParam('isResponded')
         deleteParam('descending')
         return searchParams
      })
   }

   const table = useReactTable<feedbackModel>({
      data: feedbacks.feedbacks,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      // getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
      },
   })

   return (
      <div className="w-full">
         <div className="flex md:items-center items-end flex-col gap-y-2 md:gap-y-0 md:flex-row-reverse py-4">
            <Input
               dir="rtl"
               placeholder="فیلتر پیام ها ..."
               onChange={(e) => setSearchWords(e.target.value)}
               value={searchWords}
               className="max-w-sm"
            />
            <div className="md:mr-auto space-x-2">
               <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="ml-auto">
                        <ChevronDownIcon className="mr-2 h-4 w-4" />ستون ها
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                           let id = column.id as 'id' | 'createdAt' | 'subject' | 'id' | 'content' | 'isRead' | 'isResponded'
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 className="capitalize"
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                 }
                              >
                                 {persianHeaders[id]}
                              </DropdownMenuCheckboxItem>
                           )
                        })}
                  </DropdownMenuContent>
               </DropdownMenu>
               <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="ml-auto">
                        <MixerHorizontalIcon className="mr-2 h-4 w-4" /> فیلتر
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>
                        وضعیت خواندن
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {isReadStates
                        .map((state) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={state.text}
                                 className="capitalize"
                                 onClick={() => handleIsRead(state.state)}
                                 checked={getParam('isRead') === state.state ?
                                    true :
                                    ((!getParam('isRead') && state.state === '2') ? true : false)
                                 }
                              // onCheckedChange={(value) =>
                              //    state.toggleVisibility(!!value)
                              // }
                              >
                                 {state.text}
                              </DropdownMenuCheckboxItem>
                           )
                        })}
                     <DropdownMenuSeparator />
                     <DropdownMenuLabel>
                        وضعیت پاسخ
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {isRespondedStates
                        .map((state) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={state.text}
                                 className="capitalize"
                                 onClick={() => handleIsResponded(state.state)}
                                 checked={getParam('isResponded') === state.state ?
                                    true :
                                    ((!getParam('isResponded') && state.state === '2') ? true : false)
                                 }
                              // onCheckedChange={(value) =>
                              //    state.toggleVisibility(!!value)
                              // }
                              >
                                 {state.text}
                              </DropdownMenuCheckboxItem>
                           )
                        })}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="cursor-pointer disabled:cursor-default" disabled={
                        !(searchParams.get('isRead') ||
                           searchParams.get('isResponded') ||
                           searchParams.get('search') ||
                           searchParams.get('descending'))
                     } onClick={resetFilter}>
                        ریست فیلتر ها
                     </DropdownMenuItem>
                     {/* <DropdownMenuSeparator />
                     <DropdownMenuItem disabled={!(getParam('isRead') ||
                        getParam('isResponded') ||
                        getParam('search') ||
                        getParam('descending'))} onClick={()=> {
                           deleteParam('isResponded')
                           deleteParam('search')
                           deleteParam('descending')
                        }}>
                        ریست
                     </DropdownMenuItem> */}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
         <div className="rounded-md border">
            <Table dir="rtl">
               <TableHeader dir="rtl">
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead className="text-right" key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                       header.column.columnDef.header,
                                       header.getContext()
                                    )}
                              </TableHead>
                           )
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {table.getRowModel().rows?.length && isSuccess ? (
                     table.getRowModel().rows.map((row) => (
                        <FeedbackRow row={row} key={row.id} />
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center"
                        >
                           <EmptyState />
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
         <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePage(Number(searchParams.get('pageNumber')) - 1)}
                  disabled={feedbacks.numberOfPages === 1 || !getParam('pageNumber')}
               >
                  صفحه قبل
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                     if (searchParams.get('pageNumber')) {
                        handlePage(Number(searchParams.get('pageNumber')) + 1)
                     } else {
                        handlePage(2)
                     }
                  }
                  }
                  disabled={feedbacks.numberOfPages?.toString() === getParam('pageNumber') || feedbacks.numberOfPages === 1}
               >
                  صفحه بعد
               </Button>
            </div>
         </div>
      </div >
   )
}
