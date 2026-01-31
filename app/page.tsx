"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"

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

// Mamlakatlar ro'yxati
const COUNTRIES = [
  { code: '998', name: 'Oʻzbekiston', flag: '🇺🇿', maxLength: 9 },
  { code: '7', name: 'Rossiya', flag: '🇷🇺', maxLength: 10 },
  { code: '1', name: 'AQSH/Kanada', flag: '🇺🇸', maxLength: 10 },
  { code: '44', name: 'Birlashgan Qirollik', flag: '🇬🇧', maxLength: 10 },
  { code: '49', name: 'Germaniya', flag: '🇩🇪', maxLength: 11 },
  { code: '33', name: 'Fransiya', flag: '🇫🇷', maxLength: 9 },
  { code: '90', name: 'Turkiya', flag: '🇹🇷', maxLength: 10 },
  { code: '971', name: 'BAA', flag: '🇦🇪', maxLength: 9 },
  { code: '82', name: 'Koreya', flag: '🇰🇷', maxLength: 9 },
  { code: '81', name: 'Yaponiya', flag: '🇯🇵', maxLength: 9 },
  { code: '86', name: 'Xitoy', flag: '🇨🇳', maxLength: 11 },
  { code: '91', name: 'Hindiston', flag: '🇮🇳', maxLength: 10 },
  { code: '62', name: 'Indoneziya', flag: '🇮🇩', maxLength: 11 },
  { code: '966', name: 'Saudiya Arabistoni', flag: '🇸🇦', maxLength: 9 },
  { code: '380', name: 'Ukraina', flag: '🇺🇦', maxLength: 9 },
  { code: '77', name: 'Qozogʻiston', flag: '🇰🇿', maxLength: 9 },
];

const SupermiyaLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    full_name: "", 
    phone_number: "", 
    country_code: "998",
    address: "a" 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [phoneInput, setPhoneInput] = useState("")
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  
  const nameInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const countryButtonRef = useRef<HTMLButtonElement>(null)

  const BACKEND_API_URL = "https://b.imanakhmedovna.uz/users"
  const TELEGRAM_BOT_USERNAME = "ImanAkhmedovna_bot"
  const BACKEND_TIMEOUT = 2000; // 2 soniya

  // Modal ochilganda ism inputiga focus
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 50)
    }
  }, [isModalOpen])

  // Telefon inputiga focus qaytarish
  const focusPhoneInput = () => {
    setTimeout(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.focus()
        const len = phoneInputRef.current.value.length
        phoneInputRef.current.setSelectionRange(len, len)
      }
    }, 10)
  }

  // Tanlangan mamlakatni topish
  const selectedCountry = useMemo(() => {
    return COUNTRIES.find(country => country.code === formData.country_code) || COUNTRIES[0];
  }, [formData.country_code]);

  // Ism o'zgartirish
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      full_name: e.target.value 
    }))
  }

  // Telefon raqamini o'zgartirish - SODDA VERSIYA
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Faqat raqamlar
    value = value.replace(/\D/g, '')
    
    // Maksimal uzunlik
    const maxLength = selectedCountry.maxLength
    if (value.length > maxLength) {
      value = value.slice(0, maxLength)
    }
    
    setPhoneInput(value)
    
    // Backend uchun to'liq raqam
    setFormData(prev => ({ 
      ...prev, 
      phone_number: formData.country_code + value
    }))
  }

  // Mamlakat o'zgarganda
  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({ 
      ...prev, 
      country_code: countryCode,
      phone_number: countryCode + phoneInput
    }))
    
    setIsCountryDropdownOpen(false)
    focusPhoneInput()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validatsiya
    if (!formData.full_name.trim()) {
      alert("Iltimos, ismingizni kiriting")
      nameInputRef.current?.focus()
      return
    }
    
    if (!phoneInput || phoneInput.length < 5) {
      alert("Iltimos, to'liq telefon raqamini kiriting")
      focusPhoneInput()
      return
    }
    
    setIsLoading(true)

    // 1. DARROV Telegram botga o'tish (ASOSIY QISMI)
    const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=site2`;
    const telegramWindow = window.open(telegramUrl, '_blank', 'noopener,noreferrer');

    // 2. Backendga ma'lumot yuborish (ORQA FONDA)
    const sendToBackend = async () => {
      try {
        // Timeout bilan so'rov yuboramiz
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), BACKEND_TIMEOUT)
        );

        const userData = {
          full_name: formData.full_name,
          phone_number: `+${formData.country_code}${phoneInput}`,
          address: "a"
        };

        const fetchPromise = fetch(BACKEND_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(userData),
        });

        // Faqat 2 soniya kutamiz, keyin davom etamiz
        await Promise.race([fetchPromise, timeoutPromise]);
        
        // Agar vaqt ichida javob kelsa
        const response = await fetchPromise;
        if (response.ok) {
          console.log('Ma\'lumotlar backendga muvaffaqiyatli yuborildi');
        }
      } catch (error) {
        // Xato bo'lsa ham, hech narsa qilmaymiz (konsolga yozamiz)
        console.log('Backend xatosi (bu foydalanuvchi uchun muhim emas):', error);
      }
    };

    // Backendga yuborishni parallel bajarish
    sendToBackend();

    // 3. Formani tozalash va modalni yopish
    setTimeout(() => {
      setFormData({ 
        full_name: "", 
        phone_number: "", 
        country_code: "998",
        address: "a" 
      });
      setPhoneInput("");
      setIsLoading(false);
      setIsModalOpen(false);
      
      // Telegram oynasiga focus qilish (agar foydalanuvchi uni yopmagan bo'lsa)
      if (telegramWindow && !telegramWindow.closed) {
        telegramWindow.focus();
      }
    }, 300);
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white overflow-x-hidden selection:bg-amber-500 selection:text-black relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          margin: 0;
          padding: 0;
          background: #050505;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .country-dropdown::-webkit-scrollbar {
          width: 8px;
        }
        .country-dropdown::-webkit-scrollbar-track {
          background: #2A2A2A;
          border-radius: 4px;
        }
        .country-dropdown::-webkit-scrollbar-thumb {
          background: #FFB800;
          border-radius: 4px;
        }
      `}} />

      {/* Background gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#000000]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-amber-950/8 to-transparent blur-3xl" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[90%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-700/12 via-transparent to-transparent blur-[120px]" />
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative pt-6 pb-0 px-4 flex flex-col items-center justify-start overflow-hidden min-h-screen z-10">
        
        <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
            
            {/* Profil */}
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

            {/* Sarlavha */}
            <h1 className="text-[68px] leading-[0.85] md:text-[96px] font-[900] uppercase tracking-[-0.02em] mb-2 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_4px_20px_rgba(255,193,7,0.4)]">
                HUZUR
            </h1>

            {/* Tavsif */}
            <p className="text-[15px] md:text-lg leading-relaxed mb-4 text-gray-300 max-w-md font-medium px-4">
                Qanday qilib muammolardan halos bo'lib, orzu va maqsadlarga 8 ta yo'l orqali <span className="text-amber-300 font-extrabold">TEZ</span> va <span className="text-amber-300 font-extrabold">OSON</span> yetish mumkin?
            </p>

            {/* Asosiy rasm */}
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

      {/* SECTION 2 */}
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

      {/* SECTION 3: MENTOR */}
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

            {/* Pastki rasm */}
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

      {/* MODAL - TO'G'RI ISHLAYDI */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div 
            className="bg-[#121212] border border-[#333] rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,184,0,0.15)] relative"
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
              {/* Ism familiya */}
              <input
                ref={nameInputRef}
                type="text"
                required
                value={formData.full_name}
                onChange={handleNameChange}
                className="w-full h-14 px-5 bg-[#1E1E1E] border border-[#333] rounded-[16px] focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800] focus:outline-none text-white placeholder-gray-600 font-medium transition-all"
                placeholder="Ismingizni kiriting"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    focusPhoneInput()
                  }
                }}
              />

              {/* Telefon raqami */}
              <div className="relative">
                <div className="flex gap-2">
                  {/* Mamlakat tanlovi */}
                  <div className="relative w-1/3">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full h-14 px-3 bg-[#1E1E1E] border border-[#333] rounded-[16px] flex items-center justify-between hover:border-[#FFB800] transition-all text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="font-medium">+{selectedCountry.code}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    
                    {isCountryDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => {
                            setIsCountryDropdownOpen(false)
                            focusPhoneInput()
                          }}
                        />
                        <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-[#1E1E1E] border border-[#333] rounded-[16px] z-20 shadow-lg">
                          {COUNTRIES.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountryChange(country.code)}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors ${
                                formData.country_code === country.code ? 'bg-[#FFB800]/20' : ''
                              }`}
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div className="flex flex-col items-start">
                                <span className="text-white font-medium">+{country.code}</span>
                                <span className="text-gray-400 text-xs">{country.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Telefon raqami inputi */}
                  <div className="flex-1">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={phoneInput}
                      onChange={handlePhoneChange}
                      className="w-full h-14 px-5 bg-[#1E1E1E] border border-[#333] rounded-[16px] focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800] focus:outline-none text-white placeholder-gray-600 font-mono text-lg transition-all"
                      placeholder="Raqamingiz"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSubmit(e as any)
                        }
                      }}
                      onFocus={(e) => {
                        const len = e.target.value.length
                        e.target.setSelectionRange(len, len)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <GoldButton 
                  onClick={() => {}} 
                  text={isLoading ? "Telegramga o'tilmoqda..." : "Tasdiqlash"} 
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