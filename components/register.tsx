import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, phone_number } = body

    // Validate input
    if (!full_name || !phone_number) {
      return NextResponse.json({ error: "Ism va telefon raqami talab qilinadi" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi" }, { status: 200 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
