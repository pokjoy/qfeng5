// src/components/CTABanner.tsx
'use client'

export default function CTABanner({
  message,
  buttonText,
  onClick,
}: {
  message: string
  buttonText: string
  onClick: () => void
}) {
  return (
    <section className="py-12 bg-green-600 text-white rounded-xl text-center space-y-4">
      <h3 className="text-2xl font-bold">{message}</h3>
      <button
        onClick={onClick}
        className="px-8 py-3 bg-black rounded-full font-medium hover:opacity-90 transition"
      >
        {buttonText}
      </button>
    </section>
  )
}
