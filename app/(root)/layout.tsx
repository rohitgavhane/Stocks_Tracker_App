import Header from "@/components/Header"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    // {/*Header */}
  <main className="min-h-screen text-gray-500">
    <Header></Header>
    <div className="container py-10">
            {children}
    </div>
  </main>
  )
}

export default layout