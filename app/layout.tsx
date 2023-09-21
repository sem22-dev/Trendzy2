import './globals.css'
import type { Metadata } from 'next'
import { Baloo_2 } from 'next/font/google'
import Navbar from './navbar/navbar'
import Providers from './providers'
import Sidebar from './Sidebar'


const baloo = Baloo_2({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode,
  session: any
}) {
  return (
    <html lang="en">
      <body className={baloo.className }>
        <Providers session={session}>
          <Navbar />
            <Sidebar />
            <div className="lg:ml-[209px]">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
