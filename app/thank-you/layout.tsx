import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oxirgi qadam qoldi!',
  description: "Bepul darsni qo'lga kiritish uchun telegram kanalga obuna bo'ling",
  openGraph: {
    title: 'Oxirgi qadam qoldi!',
    description: "Bepul darsni qo'lga kiritish uchun telegram kanalga obuna bo'ling",
  },
}

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}