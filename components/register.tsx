import { type NextRequest, NextResponse } from "next/server"

const CRM_URL = "https://app.webinar-payment.uz/tilda/add-client"
const SECRET_KEY = "AuJb7gedpvAgnJd"
const TARIF = "45"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, phone_number } = body

    // Validatsiya
    if (!full_name || !phone_number) {
      return NextResponse.json(
        { error: "Ism va telefon raqami talab qilinadi" },
        { status: 400 }
      )
    }

    // CRM ga yuborish uchun to'g'ri field nomlar
    const crmPayload = {
      name: full_name,
      phone: phone_number,
      TARIF: TARIF,
      secret_key: SECRET_KEY,
    }

    const crmResponse = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(crmPayload),
    })

    const crmData = await crmResponse.json().catch(() => null)

    if (!crmResponse.ok) {
      console.error("CRM xatosi:", crmResponse.status, crmData)
      return NextResponse.json(
        { error: "CRM xatosi", details: crmData },
        { status: crmResponse.status }
      )
    }

    console.log("CRM ga muvaffaqiyatli yuborildi:", crmData)

    return NextResponse.json(
      { success: true, message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Server xatosi:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}