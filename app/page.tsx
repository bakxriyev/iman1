"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const RegisterButton = ({ onClick, className = "" }: { onClick: () => void; className?: string }) => (
  <button onClick={onClick} className={`group relative inline-block ${className}`}>
    <div className="absolute -inset-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none" />
    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur-lg opacity-90 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />
    <div className="relative px-14 py-4 bg-gradient-to-b from-amber-400 to-amber-500 text-black font-black text-xl md:text-2xl rounded-full hover:from-amber-300 hover:to-amber-400 transition-all transform hover:scale-110 active:scale-95 shadow-2xl text-center border-4 border-amber-300 hover:border-amber-200">
      Ro'yxatdan o'tish
    </div>
  </button>
)

const ScrollAnimation = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </div>
  )
}

const CourseLanding = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ full_name: "", phone_number: "" })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fadeInFast {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes scaleInFast {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fade-in-fast {
        animation: fadeInFast 0.15s ease-out;
      }
      .animate-scale-in-fast {
        animation: scaleInFast 0.2s ease-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const target = new Date(2025, 9, 25, 10, 0, 0) // October 25, 2025 at 10:00 AM
      const diff = target.getTime() - now.getTime()

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // If starts with 998, keep it; otherwise add it
    let formatted = digits.startsWith("998") ? digits : "998" + digits

    // Limit to 12 digits (998 + 9 digits)
    formatted = formatted.slice(0, 12)

    // Format as +998 XX XXX XX XX
    if (formatted.length <= 3) {
      return "+" + formatted
    } else if (formatted.length <= 5) {
      return "+" + formatted.slice(0, 3) + " " + formatted.slice(3)
    } else if (formatted.length <= 8) {
      return "+" + formatted.slice(0, 3) + " " + formatted.slice(3, 5) + " " + formatted.slice(5)
    } else {
      return (
        "+" +
        formatted.slice(0, 3) +
        " " +
        formatted.slice(3, 5) +
        " " +
        formatted.slice(5, 8) +
        " " +
        formatted.slice(8)
      )
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone_number: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const cleanPhoneNumber = formData.phone_number.replace(/\D/g, "")

      const response = await fetch("https://backend.imanakhmedovna.uz/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone_number: cleanPhoneNumber,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setFormData({ full_name: "", phone_number: "" })
        setIsModalOpen(false)
        window.location.href = "https://t.me/iimaan_admin1"
      } else {
        alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        backgroundImage: "url('./background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div className="relative z-10">
        {/* Small Yellow Countdown Header */}
        <section className="bg-yellow-400 text-black py-4 px-4 shadow-2xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-lg md:text-xl font-black mb-2 drop-shadow-lg">Kurs boshlanishiga qoldi:</h2>
            <div className="flex justify-center items-center gap-2 md:gap-4">
              {[
                { value: timeLeft.days, label: "kun" },
                { value: timeLeft.hours, label: "soat" },
                { value: timeLeft.minutes, label: "daqiqa" },
                { value: timeLeft.seconds, label: "soniya" },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl md:text-3xl font-black drop-shadow-lg leading-none">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm font-bold mt-0.5 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Details Section */}
        <ScrollAnimation>
          <section className="py-6 px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <div className="border-2 border-white rounded-full px-6 py-2 inline-block bg-black/50 backdrop-blur-sm hover:border-yellow-400 transition-colors duration-300 mb-4">
                <p className="text-white font-black text-base md:text-lg">
                  Kurs boshlanish sanasi : <span className="font-black">25-26 Oktyabr</span>
                </p>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black -mb-4 leading-tight text-white drop-shadow-lg">
                OZODSAN
              </h1>

              <p className="text-[16px] md:text-base text-gray-100 leading-relaxed font-bold max-w-6xl mx-auto mb-2 rounded-xl p-6">
                Muammolar oson va yengil yechimini topish bo'yicha oliy ma'lumotli psixolog bilan 2 kun ichida
                o'zingizni ayblayverishdan halos bo'lib, orzularni amalga oshiruvchi praktika bilan hayotingizni{" "}
                <span className="text-yellow-400 font-black text-lg">10x</span> ga transformatsiya qilishni boshlaysiz.
              </p>
            </div>
          </section>
        </ScrollAnimation>

        {/* Image and Button Section */}
        <ScrollAnimation>
          <div className="relative -mt-32 md:-mt-48 h-96 md:h-screen max-h-screen flex items-center justify-center px-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="relative overflow-hidden shadow-2xl rounded-2xl">
                  <Image
                    src="./iman.png"
                    alt="Iman Akhmedovna - Psixolog"
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                <div className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-40 z-40 w-4/5">
                  <RegisterButton onClick={() => setIsModalOpen(true)} />
                </div>
                <br />
                <p className="text-center text-gray-300 text-sm md:text-base mt-4">Kursga ro'yxatdan o'ting</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Benefits Section */}
        <ScrollAnimation>
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <br />
              <br />
              <br />
              <h2 className="text-4xl font-black text-center mb-8">
                Ro'yxatdan o'tish orqali <span className="text-red-500">qo'lga kiritasiz:</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white text-black rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="./royhat.webp"
                      alt="Dars materiallari"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-lg leading-relaxed">
                    Xotira va miyani to'liq potensialini ochib berishga yordam beradigan 7 haftalik darslar
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-red-700 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="/tarif.webp"
                      alt="Bonus"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-lg leading-relaxed">
                    Eslab qolish bo'yicha champion kuratorlar nazorati
                  </p>
                </div>

                <div className="bg-white text-black rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="/live.webp"
                      alt="Amaliy mashqlar"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-lg leading-relaxed">
                    Iman Akhmedovna bilan 8+ jonli efirlar va amaliy mashqlar
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-white rounded-xl flex items-center justify-center font-bold text-5xl">
                    <Image
                      src="/iphonee.png"
                      alt="Amaliy mashqlar"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-lg leading-relaxed">
                    iPhone 17 telefoni yutib olish imkoniyati va boshqa sovrinlar
                  </p>
                </div>
              </div>

              <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-yellow-400/30">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">Qo'shimcha bonuslar:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold text-xl flex-shrink-0">✓</span>
                    <p>Narhi 1 millionlik "TAHAJJUDGA OSHIQLAR" kursi mutlaqo bepul</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold text-xl flex-shrink-0">✓</span>
                    <p>Narhi 2 millionlik "HUZUR" kursi (oila psixologiyasi)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold text-xl flex-shrink-0">✓</span>
                    <p>Bepul konsultatsiya yutib olish imkoniyati</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold text-xl flex-shrink-0">✓</span>
                    <p>Keyingi kurslarga 50% lik chegirma</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold text-xl flex-shrink-0">✓</span>
                    <p>Narhi 2 millionlik "Nikoh madaniyati" kursini yutib olish</p>
                  </div>
                </div>
              </div>

              <div className="text-center -mb-12">
                <RegisterButton onClick={() => setIsModalOpen(true)} />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Instructor Section */}
        <ScrollAnimation>
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto ">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-5">Iman Akhmedovna</h2>
              <p className="text-center text-yellow-400 font-bold text-lg mb-8">
                Oliy ma'lumotli Psixolog va Psixoterapevt
              </p>

              <div className="space-y-3 max-w-3xl mx-auto mb-8">
                <div className="bg-black/70 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-3 hover:border-yellow-400 transition-colors duration-300">
                  <p className="text-white font-semibold">3 yillik tajribaga ega Oliy ma'lumotli Psixolog</p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-6 py-3">
                  <p className="text-white font-semibold">
                    65,000 dan ortiq ayol qizlarga muammolariga tez va oson yechim topib bergan
                  </p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-3 hover:border-yellow-400 transition-colors duration-300">
                  <p className="text-white font-semibold">
                    O'zbekistonda yagona ekspert - muammolarga oson yechim topish
                  </p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-6 py-3">
                  <p className="text-white font-semibold">Shaxsiy rivojlanish bo'yicha mentor</p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-3 hover:border-yellow-400 transition-colors duration-300">
                  <p className="text-white font-semibold">
                    100 dan ortiq shogirdlarga muammolarga oson yechimini topish sirlarini o'rgatgan
                  </p>
                </div>
              </div>

              <div className="relative h-80 md:h-96 flex items-center justify-center -mb-20 px-4">
                <div className="relative w-full max-w-sm">
                  <div className="relative overflow-hidden shadow-2xl mb-40 rounded-2xl">
                    <Image
                      src="./iman.png"
                      alt="Iman Akhmedovna"
                      width={400}
                      height={500}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <RegisterButton onClick={() => setIsModalOpen(true)} />
              </div>
            </div>

            <footer className="w-full py-6 mt-6 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <p className="text-gray-500 text-sm">Created by</p>
          <a
            href="https://t.me/it_zoneuz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity duration-300 transform hover:scale-105"
          >
            <Image src="./itzone.png" alt="IT Zone Telegram" width={150} height={100} className="cursor-pointer" />
          </a>
        </div>
      </footer>
          </section>
        </ScrollAnimation>

        {/* Contact Section */}
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in-fast">
            <h3 className="text-2xl font-bold text-black mb-6">Ro'yxatdan o'tish</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-black font-semibold mb-2">Ism va Familiya</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none text-black"
                  placeholder="Ismingizni kiriting"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Telefon raqami</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none text-black font-mono"
                  placeholder="+998 XX XXX XX XX"
                  maxLength={17}
                />
                <p className="text-xs text-gray-500 mt-1">Faqat O'zbekiston raqami: +998 XX XXX XX XX</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-300 text-black font-bold rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseLanding
