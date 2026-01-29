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
    {/* Orqa fon nuri (Glow) */}
    <div className="absolute -inset-1 bg-[#FFB800] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />
    
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative  w-full overflow-hidden rounded-[12px] 
                   bg-gradient-to-b from-[#FFDA8F] via-[#DFA950] to-[#B38029]
                   border-t border-[#FFEBB0]
                   pb-[12px] 
                   shadow-[0_10px_20px_rgba(223,169,80,0.3)]
                   transition-all duration-150 
                   ${disabled ? 'opacity-70 cursor-not-allowed' : 'active:translate-y-[6px] active:pb-0'}`}
    >
      {/* Tugma ichki qismi */}
      <div className="bg-gradient-to-b from-[#FAD996] via-[#EAB561] to-[#D4983D] 
                      w-full h-full py-6 px-6 rounded-[16px]
                      shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
        <span className="text-[#1A1100] font-[600] text-[24px] md:text-2xl tracking-wide drop-shadow-sm">
          {text}
        </span>
      </div>
      
      {/* 3D qalinligi */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#8F6218] rounded-b-[18px]" />
    </button>
  </div>
)

// --- 2. ASOSIY PAGE ---

const SupermiyaLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ full_name: "", phone_number: "" })
  const [isLoading, setIsLoading] = useState(false)

  // BACKEND API URL - Bu yerni o'z backend URLingizga o'zgartiring
  const BACKEND_API_URL = "https://b.imanakhmedovna.uz/users"
  
  // TELEGRAM BOT USERNAME - Bu yerni o'z bot usernameingizga o'zgartiring (@ belgisiz)
  const TELEGRAM_BOT_USERNAME = "ImanAkhmedovna_bot"

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    let formatted = digits.startsWith("998") ? digits : "998" + digits
    formatted = formatted.slice(0, 12)
    
    if (formatted.length <= 3) return "+" + formatted
    if (formatted.length <= 5) return "+" + formatted.slice(0, 3) + " " + formatted.slice(3)
    if (formatted.length <= 8) return "+" + formatted.slice(0, 3) + " " + formatted.slice(3, 5) + " " + formatted.slice(5)
    return "+" + formatted.slice(0, 3) + " " + formatted.slice(3, 5) + " " + formatted.slice(5, 8) + " " + formatted.slice(8)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone_number: formatPhoneNumber(e.target.value) })
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
        // Xatolik bo'lsa ham, user ko'rmaydi
        console.error('Backend yuborishda xatolik:', err)
      })

      setIsModalOpen(false)
      setFormData({ full_name: "", phone_number: "" })
      
      // 100ms kechikish - modal yopilishi uchun
      setTimeout(() => {
        // Telegram bot linkini ochish
        const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(formData.phone_number)}`
        window.open(telegramUrl, '_blank')
        setIsLoading(false)
      }, 100)

      // Background'da backend so'rovini kutish (agar kerak bo'lsa)
      // Bu user tajribasiga ta'sir qilmaydi
      submitPromise.then(() => {
        console.log('Ma\'lumotlar backendga muvaffaqiyatli yuborildi')
      })

    } catch (error) {
      console.error('Xatolik:', error)
      setIsLoading(false)
      // Xatolik bo'lsa ham, foydalanuvchini Telegram botga yo'naltiring
      const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(formData.phone_number)}`
      window.open(telegramUrl, '_blank')
      setIsModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white overflow-x-hidden selection:bg-amber-500 selection:text-black relative">
      
      {/* GLOBAL GRADIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#000000]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-amber-950/8 to-transparent blur-3xl" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[90%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-700/12 via-transparent to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent blur-3xl" />
      </div>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className="relative pt-6 pb-0 px-4 flex flex-col items-center justify-start overflow-hidden min-h-screen z-10">
        
        <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
            
            {/* Profil */}
            <div className="flex items-center gap-2 mb-3 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-full border border-amber-800/60 shadow-[0_0_25px_rgba(251,191,36,0.15)]">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-500/80 shadow-lg">
                      <Image src="/insta.jpg" alt="Avatar" width={32} height={32} className="object-cover" />
                </div>
                <span className="text-sm font-bold text-amber-50 tracking-wide">iimaan_akhmedovna</span>
            </div>

            {/* Sarlavha */}
            <h1 className="text-[68px] leading-[0.85] md:text-[96px] font-[900] uppercase tracking-[-0.02em] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_4px_20px_rgba(255,193,7,0.4)] font-impact">
                HUZUR
            </h1>

            {/* Tavsif */}
            <p className="text-[15px] md:text-lg leading-relaxed mb-4 text-gray-300 max-w-md font-medium px-4">
                Qanday qilib muammolardan halos bo'lib, orzu va maqsadlarga 8 ta yo'l orqali <span className="text-amber-300 font-extrabold">TEZ</span> va <span className="text-amber-300 font-extrabold">OSON</span> yetish mumkin?
            </p>

            {/* Rasm */}
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
                  className="object-contain object-top transition-transform duration-1000 group-hover:scale-[1.05]"
                  priority
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

      <section className="relative py-16 -mt-40 px-4 z-10">
        <div className="max-w-md mx-auto">
            <h2 className="text-[32px] font-[900] text-center mb-10 leading-[1.1] tracking-tight">
                Ro'yxatdan o'tish <br/>
                orqali <span className="text-[#FF3B30] drop-shadow-[0_0_10px_rgba(255,59,48,0.4)]">qo'lga kiritasiz:</span>
            </h2>

            <div className="space-y-6">
                {/* KARTA 1 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-amber-500/30">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center">
                          <Image src="/royhat.webp" alt="Kurs dasturi" fill className="object-contain drop-shadow-xl" />
                    </div>
                    <h3 className="text-[#1A1100] font-[800] text-[18px] leading-tight px-4">
                        Kurs dasturi <br/> va batafsil ma'lumotlar
                    </h3>
                </div>

                {/* KARTA 2 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-amber-500/30">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center">
                          <Image src="/tarif.webp" alt="Arzon narx" fill className="object-contain drop-shadow-xl" />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                        Eng arzon narxda <br/> kursga qo'shilish
                    </h3>
                </div>

                {/* KARTA 3 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-amber-500/30">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center">
                          <Image src="/number.webp" alt="Xotira" fill className="object-contain drop-shadow-xl" />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                       Istalgan muammodan 8 ta qadam orqali tez va oson chiqib ketish yo'llarini o'rganasiz
                    </h3>
                </div>

                {/* KARTA 4 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-amber-500/30">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center">
                          <Image src="/line.webp" alt="Xotira" fill className="object-contain drop-shadow-xl" />
                    </div>
                    <h3 className="text-[#1A1100] font-[600] text-[18px] leading-tight px-4">
                       Qarz, kreditlardan chiqish, orzu maqsadlarga erishish, ibodatlarda mustahkam bo'lish va duolar ijobati uchun qo'llanma va materiallar
                    </h3>
                </div>

                {/* KARTA 5 */}
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-[32px] p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border-2 border-transparent hover:border-amber-500/30">
                    <div className="h-[140px] w-full relative mb-4 flex items-center justify-center">
                          <Image src="/bonus.webp" alt="Xotira" fill className="object-contain drop-shadow-xl" />
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
            
            <h2 className="text-[36px] font-[900] text-transparent bg-clip-text bg-white tracking-tighter mb-8 text-center leading-none font-impact">
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
                    <div key={index} className="w-full border border-[#D4AF37]/30 rounded-[20px] py-3 px-0 text-center bg-gradient-to-b from-[#111] to-[#0a0a0a] hover:from-[#1a1a1a] hover:to-[#111] hover:border-[#D4AF37] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] group">
                        <p className="text-gray-200 group-hover:text-white font-[400] text-[14px] leading-[1]">
                            {item}
                        </p>
                    </div>
                ))}
            </div>

            {/* Pastki rasm */}
            <div className="relative -mt-42 w-full max-w-[900px] aspect-square mb-8 rounded-b-3xl overflow-hidden">
                 <Image
                    src="/iman.png"
                    alt="Iman Akhmedovna"
                    fill
                    className="object-cover w-full h-full object-top"
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#121212] border border-[#333] rounded-[32px] p-6 md:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,184,0,0.15)] relative transform scale-100 animate-in zoom-in-95 duration-200"
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
                  value={formData.phone_number}
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