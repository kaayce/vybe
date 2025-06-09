import { SiteHeader } from '@/components/site-header'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 w-full relative">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})
