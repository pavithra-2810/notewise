import react from 'react'
import SideBar from './_components/SideBar'
import Header from './_components/Header'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className='w-64 h-screen fixed'>
        <SideBar />
      </div>
      <div className='ml-64 flex-1 flex flex-col'>
        <Header />
        <div className='p-10'>
          <div className="bg-white rounded-xl shadow-md p-8 min-h-[500px] border border-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
