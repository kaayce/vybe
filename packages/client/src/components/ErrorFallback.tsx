export const ErrorFallback = ({
  message = 'Something went wrong',
}: {
  message?: string
}) => (
  <div className="w-full h-full flex items-center justify-center text-center bg-gray-100 text-gray-700 p-4">
    {message}
  </div>
)
