"use client"

import React, { useState } from "react"
import Image from "next/image"


const CurvedArrow = () => (
  <svg 
    width="40" 
    height="40" 
    viewBox="12 12 60 41" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -right-2 -bottom-8 md:-right-8 md:-bottom-2 transform rotate-0 md:rotate-0 opacity-80"
  >
    <path 
      d="M39.6953 10.9575C39.6953 10.9575 23.3276 27.6432 10.5186 52.8988M39.6953 10.9575C32.1281 12.0287 18.043 12.3524 18.043 12.3524M39.6953 10.9575C41.3537 17.653 41.5367 31.7946 41.5367 31.7946" 
      stroke="#9CA3AF" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

// Oltin 3D Tugma
const GoldButton = ({ onClick, text = "Ro'yxatdan o'tish", className = "", disabled = false }: { 
  onClick: () => void; 
  text?: string; 
  className?: string;
  disabled?: boolean;
}) => (
  <div className={`relative group w-full max-w-md mx-auto ${className}`}>
    <div className="absolute -inset-1 bg-[#FFB800] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />
    
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full overflow-hidden rounded-[12px] 
                   bg-gradient-to-b from-[#FFDA8F] via-[#DFA950] to-[#B38029]
                   border-t border-[#FFEBB0]
                   pb-[12px] 
                   shadow-[0_10px_20px_rgba(223,169,80,0.3)]
                   transition-all duration-150 
                   ${disabled ? 'opacity-70 cursor-not-allowed' : 'active:translate-y-[6px] active:pb-0'}`}
    >
      <div className="bg-gradient-to-b from-[#FAD996] via-[#EAB561] to-[#D4983D] 
                      w-full h-full py-6 px-6 rounded-[16px]
                      shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
        <span className="text-[#1A1100] font-[600] text-[24px] md:text-2xl tracking-wide drop-shadow-sm">
          {text}
        </span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#8F6218] rounded-b-[18px]" />
    </button>
  </div>
)

const SupermiyaLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ full_name: "", phone_number: "" })
  const [isLoading, setIsLoading] = useState(false)

  const BACKEND_API_URL = "https://b.imanakhmedovna.uz/users"
  const TELEGRAM_BOT_USERNAME = "ImanAkhmedovna_bot"

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    
    if (!value.startsWith('998')) {
      if (value.length > 0) {
        value = '998' + value
      }
    }
    
    if (value.length > 12) {
      value = value.slice(0, 12)
    }
    
    let displayValue = ''
    if (value.length > 0) {
      displayValue = '+' + value.slice(0, 3)
      if (value.length > 3) {
        displayValue += ' ' + value.slice(3, 5)
      }
      if (value.length > 5) {
        displayValue += ' ' + value.slice(5, 8)
      }
      if (value.length > 8) {
        displayValue += ' ' + value.slice(8, 12)
      }
    }
    
    setFormData({ 
      ...formData, 
      phone_number: value
    })
    
    e.target.value = displayValue
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const submitPromise = fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          timestamp: new Date().toISOString()
        })
      }).catch(err => {
        console.error('Backend yuborishda xatolik:', err)
      })

      setIsModalOpen(false)
      setFormData({ full_name: "", phone_number: "" })
      
      setTimeout(() => {
        const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(formData.phone_number)}`
        window.open(telegramUrl, '_blank')
        setIsLoading(false)
      }, 100)

      submitPromise.then(() => {
        console.log('Ma\'lumotlar backendga muvaffaqiyatli yuborildi')
      })

    } catch (error) {
      console.error('Xatolik:', error)
      setIsLoading(false)
      const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(formData.phone_number)}`
      window.open(telegramUrl, '_blank')
      setIsModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white overflow-x-hidden selection:bg-amber-500 selection:text-black relative">
      
      {/* CRITICAL CSS - Inline for instant paint */}
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'system-ui';
          font-display: swap;
        }
        
        /* Critical above-the-fold styles */
        body {
          margin: 0;
          padding: 0;
          background: #050505;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        /* Prevent layout shift */
        .hero-skeleton {
          min-height: 100vh;
          background: linear-gradient(to bottom, #0a0a0a, #050505, #000000);
        }
        
        /* Optimize font loading */
        .text-render-optimize {
          text-rendering: optimizeSpeed;
          -webkit-font-smoothing: antialiased;
        }
      `}} />

      {/* GRADIENT BACKGROUND - Static, no animations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#000000]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-amber-950/8 to-transparent blur-3xl" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[90%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-700/12 via-transparent to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent blur-3xl" />
      </div>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className="relative pt-6 pb-0 px-4 flex flex-col items-center justify-start overflow-hidden min-h-screen z-10">
        
        <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
            
            {/* Profil - Lazy load */}
            <div className="flex items-center gap-2 mb-3 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-full border border-amber-800/60 shadow-[0_0_25px_rgba(251,191,36,0.15)]">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500/80 shadow-lg bg-amber-900/20">
                      <Image 
                        src="/insta.jpg" 
                        alt="Avatar" 
                        width={32} 
                        height={32} 
                        className="object-cover" 
                        loading="lazy"
                        quality={75}
                      />
                </div>
                <span className="text-sm font-bold text-amber-50 tracking-wide">iimaan_akhmedovna</span>
            </div>

            {/* Sarlavha - No image, pure CSS */}
            <h1 className="text-[68px] leading-[0.85] md:text-[96px] font-[900] uppercase tracking-[-0.02em] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_4px_20px_rgba(255,193,7,0.4)]">
                HUZUR
            </h1>

            {/* Tavsif */}
            <p className="text-[15px] md:text-lg leading-relaxed mb-4 text-gray-300 max-w-md font-medium px-4">
                Qanday qilib muammolardan halos bo'lib, orzu va maqsadlarga 8 ta yo'l orqali <span className="text-amber-300 font-extrabold">TEZ</span> va <span className="text-amber-300 font-extrabold">OSON</span> yetish mumkin?
            </p>

            {/* Rasm - Priority for LCP */}
            <div className="relative w-full max-w-[550px] h-[650px] -mt-26 -mb-20 z-10 group">
              
              <div 
                className="absolute inset-0 z-20"
                style={{
                  maskImage: 'radial-gradient(circle at 50% 40%, black 30%, transparent 85%)',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 30%, transparent 85%)'
                }}
              >
                <Image 
                  src="/logo2.png"
                  alt="Iman Akhmedovna"
                  fill
                  sizes="(max-width: 768px) 550px, 550px"
                  className="object-contain object-top"
                  priority
                  quality={85}
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-600/10 blur-[100px] rounded-full z-0 pointer-events-none" />
            </div>

            {/* Tugma */}
            <div className="w-full px-4 -mt-12 relative z-40 flex flex-col items-center">
                <GoldButton onClick={() => setIsModalOpen(true)} />
                
                <div className="relative mt-3 flex items-center justify-center">
                    <p className="text-amber-300/90 text-[13px] font-semibold tracking-widest uppercase">
                        Kursga oldindan ro'yxatdan o'ting
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* SECTION 2 - Lazy load all images */}
      <section className="relative py-16 -mt-20 px-4 z-10">
        <div className="max-w-md mx-auto">
            <h2 className="text-[32px] font-[900] text-center mb-10 leading-[1.1] tracking-tight">
                Ro'yxatdan o'tish <br/>
                orqali <span className="text-[#FF3B30] drop-shadow-[0_0_10px_rgba(255,59,48,0.4)]">qo'lga kiritasiz:</span>
            </h2>

            <div className="space-y-6">
                {/* KARTA 1 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center bg-gray-100">
                          <Image 
                            src="/royhat.webp" 
                            alt="Kurs dasturi" 
                            fill 
                            className="object-contain" 
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                    </div>
                    <h3 className="text-[#1A1100] font-[800] text-[18px] leading-tight px-4">
                        Kurs dasturi <br/> va batafsil ma'lumotlar
                    </h3>
                </div>

                {/* KARTA 2 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center bg-gray-100">
                          <Image 
                            src="/tarif.webp" 
                            alt="Arzon narx" 
                            fill 
                            className="object-contain" 
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                        Eng arzon narxda <br/> kursga qo'shilish
                    </h3>
                </div>

                {/* KARTA 3 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center bg-gray-100">
                          <Image 
                            src="/number.webp" 
                            alt="Xotira" 
                            fill 
                            className="object-contain" 
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                       Istalgan muammodan 8 ta qadam orqali tez va oson chiqib ketish yo'llarini o'rganasiz
                    </h3>
                </div>

                {/* KARTA 4 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center bg-gray-100">
                          <Image 
                            src="/line.webp" 
                            alt="Xotira" 
                            fill 
                            className="object-contain" 
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                       Qarz, kreditlardan chiqish, orzu maqsadlarga erishish, ibodatlarda mustahkam bo'lish va duolar ijobati uchun qo'llanma va materiallar
                    </h3>
                </div>

                {/* KARTA 5 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center bg-gray-100">
                          <Image 
                            src="/bonus.webp" 
                            alt="Xotira" 
                            fill 
                            className="object-contain" 
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                       Hech qayerda berilmagan sirli bonuslar (sizga yoqishi aniq)
                    </h3>
                </div>
            </div>
        </div>
      </section>

      {/* ==================== SECTION 3: MENTOR ==================== */}
      <section className="relative pt-10 pb-16 -mt-12 px-4 z-10">
        <div className="max-w-md mx-auto flex flex-col items-center">
            
            <h2 className="text-[36px] font-[900] text-white tracking-tighter mb-8 text-center leading-none">
                Iman Akhmedovna
            </h2>

            {/* Yutuqlar */}
            <div className="w-full space-y-0 mb-10">
                {[
                    "O'quvchilarni eng tez va oson natijaga olib chiqish bo'yicha Uzbekistonda yagona ekspert",
                    "Oliy ma'lumotli psixolog, O'zbekiston respublikasi 30 yillik ko'krak nishoni sohibasi",
                    "Filologiya fanlari PhD mustaqil izlanuvchisi, 3-darajali yurist.",
                    "Insonlar ichki hissiyotlari, ong osti dasturlari bilan ishlovchi mentor",
                    "3 yil ichida 80.000 + o'quvchilarimga ong osti dasturlarini to'g'irlash orqali muammolarida tez va oson chiqishlariga yordam berdim"
                ].map((item, index) => (
                    <div key={index} className="w-full border border-[#D4AF37]/30 rounded-[20px] py-3 px-0 text-center bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                        <p className="text-gray-200 font-[400] text-[14px] leading-[1]">
                            {item}
                        </p>
                    </div>
                ))}
            </div>

            {/* Pastki rasm - Lazy load */}
            <div className="relative -mt-10 w-full max-w-[900px] aspect-square mb-8 rounded-b-3xl overflow-hidden bg-[#0a0a0a]">
                 <Image
                    src="/iman.png"
                    alt="Iman Akhmedovna"
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-cover w-full h-full object-top"
                    loading="lazy"
                    quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
            </div>

            <div className="w-full px-4 -mt-10 relative z-30 flex flex-col items-center">
                <GoldButton onClick={() => setIsModalOpen(true)} />
                <div className="relative mt-4 flex items-center justify-center">
                    <p className="text-amber-200/80 text-sm font-medium tracking-wider uppercase">Kursga oldindan ro'yxatdan o'ting</p>
                </div>
            </div>

        </div>
      </section>

      {/* ==================== MODAL ==================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#121212] border border-[#333] rounded-[32px] p-6 md:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,184,0,0.15)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl"
                onClick={() => setIsModalOpen(false)}
            >
                &times;
            </button>
            
            <h3 className="text-2xl font-[900] text-white text-center mb-6 uppercase tracking-tight">
                Ro'yxatdan o'tish
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase mb-2 ml-2 tracking-wider">Ism va Familiya</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full h-14 px-5 bg-[#1E1E1E] border border-[#333] rounded-[16px] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] focus:outline-none text-white placeholder-gray-600 font-medium transition-all"
                  placeholder="Ismingizni kiriting"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase mb-2 ml-2 tracking-wider">Telefon raqami</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number.length > 0 ? '+' + formData.phone_number.slice(0, 3) + (formData.phone_number.length > 3 ? ' ' + formData.phone_number.slice(3, 5) : '') + (formData.phone_number.length > 5 ? ' ' + formData.phone_number.slice(5, 8) : '') + (formData.phone_number.length > 8 ? ' ' + formData.phone_number.slice(8, 12) : '') : ''}
                  onChange={handlePhoneChange}
                  className="w-full h-14 px-5 bg-[#1E1E1E] border border-[#333] rounded-[16px] focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] focus:outline-none text-white placeholder-gray-600 font-mono text-lg transition-all"
                  placeholder="+998"
                  disabled={isLoading}
                />
              </div>

              <div className="pt-4">
                <GoldButton 
                  onClick={() => {}} 
                  text={isLoading ? "Yuborilmoqda..." : "Tasdiqlash"} 
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupermiyaLanding