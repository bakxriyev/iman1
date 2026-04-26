'use client'

export default function ThankYouPage() {
  const telegramLink = 'https://t.me/iman_ahmedovnaa_bot?start=huzurkurs'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#EDECEA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* Sarlavha */}
      <h1
        style={{
          fontSize: '32px',
          fontWeight: '900',
          color: '#111111',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          lineHeight: '1.1',
          marginBottom: '20px',
          maxWidth: '440px',
        }}
      >
        OXIRGI QADAM QOLDI!
      </h1>

      {/* Tavsif matni */}
      <p
        style={{
          fontSize: '15px',
          color: '#444444',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '300px',
          marginBottom: '4px',
        }}
      >
       <b>Huzur kursi </b> haqida barcha yangiliklarni kuzatib borish uchun quyidagi tugmani bosib Telegram kanalga obuna bo'ling.
        <br />

      </p>
     

      {/* O'q belgisi */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '2px',
            height: '36px',
            backgroundColor: '#444444',
          }}
        />
        <svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 10L0 0H16L8 10Z" fill="#444444" />
        </svg>
      </div>

      {/* OBUNA BO'LISH tugmasi */}
      <button
        type="button"
        onClick={() => window.open(telegramLink, '_blank', 'noopener,noreferrer')}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '340px',
          backgroundColor: '#1AADEA',
          color: '#FFFFFF',
          fontWeight: '900',
          fontSize: '18px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '22px 16px',
          borderRadius: '50px',
          border: 'none',
          boxShadow: '0 6px 0 #0E87BB',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          cursor: 'pointer',
          userSelect: 'none',
          outline: 'none',
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(3px)'
          el.style.boxShadow = '0 3px 0 #0E87BB'
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 6px 0 #0E87BB'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 6px 0 #0E87BB'
        }}
        onTouchStart={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(3px)'
          el.style.boxShadow = '0 3px 0 #0E87BB'
        }}
        onTouchEnd={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 6px 0 #0E87BB'
        }}
      >
        Darsni Ko'rish
      </button>
    </div>
  )
}