import { APP_NAME } from '@/lib/constants'

export function SiteHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 shrink-0">
        <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
          {APP_NAME}
        </h1>
      </div>
    </header>
  )
}
