"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const RegisterButton = ({ onClick, className = "" }: { onClick: () => void; className?: string }) => (
  <button onClick={onClick} className={`group relative inline-block w-full ${className}`}>
    <div className="absolute -inset-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none" />
    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur-lg opacity-90 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />
    <div className="relative px-10 py-4 bg-gradient-to-b from-amber-400 to-amber-500 text-black font-black text-xl md:text-2xl rounded-full hover:from-amber-300 hover:to-amber-400 transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-center border-4 border-amber-300 hover:border-amber-200 w-full">
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
      
      /* Mobile background fix */
      @media (max-width: 768px) {
        .mobile-bg-fixed {
          background-attachment: scroll !important;
        }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const target = new Date(2025, 9, 25, 10, 0, 0)
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
    const digits = value.replace(/\D/g, "")
    let formatted = digits.startsWith("998") ? digits : "998" + digits
    formatted = formatted.slice(0, 12)

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
    <div className="min-h-screen w-full bg-[#1a1a1a]">
      {/* Background Layer - Fixed for mobile */}
      <div
        className="fixed inset-0 w-full h-full mobile-bg-fixed"
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.4) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-6 text-white">
        {/* Countdown Header */}
        <section className="bg-yellow-400 text-black py-2 px-2 shadow-2xl sticky top-0 z-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-base md:text-lg font-black -mb-1 drop-shadow-lg">Kurs boshlanishiga qoldi:</h2>
            <div className="flex justify-center items-center gap-2 md:gap-3">
              {[
                { value: timeLeft.days, label: "kun" },
                { value: timeLeft.hours, label: "soat" },
                { value: timeLeft.minutes, label: "daqiqa" },
                { value: timeLeft.seconds, label: "soniya" },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl md:text-2xl font-black drop-shadow-lg leading-none">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs font-bold mt-0.5 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Details Section */}
        <ScrollAnimation>
          <section className="py-4 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="border-2 border-white rounded-full px-6 py-2 inline-block bg-black/50 backdrop-blur-sm hover:border-yellow-400 transition-colors duration-300 mb-3">
                <p className="text-white font-black text-base md:text-lg">
                  Kurs boshlanish sanasi : <span className="font-black">25 - Oktyabr</span>
                </p>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black -mb-2 leading-tight text-white drop-shadow-lg">
                OZODSAN
              </h1>

              <p className="text-[15px] md:text-base  text-gray-100 leading-relaxed font-bold max-w-6xl mx-auto mb-0 rounded-xl px-6 py-3">
                Muammolar oson va yengil yechimini topish bo'yicha oliy ma'lumotli psixolog bilan 2 kun ichida
                o'zingizni ayblayverishdan halos bo'lib, orzularni amalga oshiruvchi praktika bilan hayotingizni{" "}
                <span className="text-yellow-400 font-black text-lg">10x</span> ga transformatsiya qilishni boshlaysiz.
              </p>
            </div>
          </section>
        </ScrollAnimation>

        {/* Image and Button Section */}
        <ScrollAnimation>
          <div className="px-0 -mt-45">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="relative overflow-hidden shadow-2xl rounded-2xl">
                  <Image
                    src="./iman.png"
                    alt="Iman Akhmedovna - Psixolog"
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover object-top"
                    priority
                  />
                  
                  {/* Button overlay on image bottom */}
                  <div className="absolute -bottom-8 left-0 right-0 px-8">
                    <RegisterButton onClick={() => setIsModalOpen(true)} className="w-full" />
                    <p className="text-center text-gray-200 text-sm md:text-base mt-3 drop-shadow-lg">Kursga ro'yxatdan o'ting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Benefits Section */}
        <ScrollAnimation>
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
                Ro'yxatdan o'tish orqali <span className="text-red-500">qo'lga kiritasiz:</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-white rounded-xl flex items-center justify-center">
                    <Image
                      src="/iphonee.png"
                      alt="iPhone 17"
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
                  <p className="font-bold text-[15px] leading-relaxed">
                    Narhi 1 millionlik qarzdorlik, kambag’allikdan halos bo’lib, hotirjamlikda yashashingizga sabab bo’ladigan TAHAJJUDGA OSHIQLAR kursi mutlaqo bepul bonusga olish
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="/royhat.webp"
                      alt="Amaliy mashqlar"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-[15px] leading-relaxed">
                    Narhi 2 millionlik HUZUR kursi. Har bir oilada bitta psixolog bo’lsin shiori ostida ochilgan kurs, har qanday muammolar kelib chiqish ildizini topib, uni yechimini qilish o’rgatilgan.
                  </p>
                </div>

                <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="./live.webp"
                      alt="Dars materiallari"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-lg leading-relaxed">
                    Bepul konsultatsiya yutib olish imkoniyati
                  </p>
                </div>
                <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
                  <div className="mb-6 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="./chegirma.jpg"
                      alt="Dars materiallari"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-bold text-lg leading-relaxed">
                    Keyingi kurslarga 50% lik chegirma
                  </p>
                </div>
                <div className="bg-red-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:scale-105">
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
                    Narhi 2 millionlik Nikoh madaniyati kursini yutib olish imkoniyatini
                  </p>
                </div>
              </div>

              {/* <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-yellow-400/30">
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
              </div> */}

              <div className="text-center">
                <RegisterButton onClick={() => setIsModalOpen(true)} />
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Instructor Section */}
        <ScrollAnimation>
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-5">Iman Akhmedovna</h2>
              
              <div className="space-y-3 max-w-3xl mx-auto mb-8">
                <div className="bg-black/70 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-3 hover:border-yellow-400 transition-colors duration-300">
                  <p className="text-white font-semibold">3 yillik tajribaga ega Oliy ma’lumotli Psixolog, psixoterapevt</p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-6 py-3">
                  <p className="text-white font-semibold">
                    65.000 dan ortiq ayol qizlarga muammolariga tez,  oson va yengil yechimini topib berish bo’yicha O’zbekistonda yagona ekspert
                  </p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-3 hover:border-yellow-400 transition-colors duration-300">
                  <p className="text-white font-semibold">
                    Shaxsiy rivojlanish bo’yicha mentor
                  </p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-6 py-3">
                  <p className="text-white font-semibold">100 dan ortiq shogirdlarga muammolarga oson va yengil yechimini topish sirlarini o’rgatgan ekspert</p>
                </div>
                <div className="bg-black/70 backdrop-blur-sm border-2 border-white rounded-2xl px-6 py-3 hover:border-yellow-400 transition-colors duration-300">
                  <p className="text-white font-semibold">
                    Bizni o’quvchilar eng tezlikda natijaga chiqish bo’yicha O’zbekistonda rekord o’rnatishmoqda
                  </p>
                </div>
              </div>

              <div className="max-w-md mx-auto -mt-40">
                <div className="relative overflow-hidden shadow-2xl rounded-2xl">
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

              <div className="text-center mb-8">
                <RegisterButton onClick={() => setIsModalOpen(true)} />
              </div>

              <footer className="w-full py-6">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-gray-500 text-sm">Created by</p>
                  <a
                    href="https://t.me/it_zoneuz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity duration-300 transform hover:scale-105"
                  >
                    <Image src="/itzone.png" alt="IT Zone Telegram" width={150} height={100} className="cursor-pointer" />
                  </a>
                </div>
              </footer>
            </div>
          </section>
        </ScrollAnimation>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-fast overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in-fast my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-black mb-6">Ro'yxatdan o'tish</h3>

            <div className="space-y-4">
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
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseLanding