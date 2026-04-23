// app/api/register/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// ─── Yangi CRM sozlamalari ────────────────────────────
const CRM_URL = "https://app.webinar-payment.uz/tilda/add-client"
const SECRET_KEY = "AuJb7gedpvAgnJd"
const TARIF = "45"

// ─── POST so‘rov ──────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, phone_number, address } = body

    // Validatsiya
    if (!full_name || !phone_number) {
      console.warn("❌ Yetarli maʼlumot yo‘q:", body)
      return NextResponse.json(
        { error: "Ism va telefon raqami talab qilinadi" },
        { status: 400 }
      )
    }

    const userData = {
      full_name: full_name.trim(),
      phone_number: phone_number.trim(),   // +998901234567 kabi formatda
      address: address?.trim() || "a",
    }

    // Supabase server-client (service_role bilan)
    const supabase = createClient(
      'https://vxpvgeyktgyasegvycfp.supabase.co',
      'sb_publishable_pXpHGuZFzmhJUD6FkQeapQ__7D78i4w'
    )

    // ─── CRM payload ──────────────────────────────────
    const crmPayload = {
      name: userData.full_name,
      phone: userData.phone_number,
      TARIF,
      secret_key: SECRET_KEY,
    }

    console.log("📤 CRM ga yuborilmoqda:", crmPayload)
    console.log("📤 Supabase ga yozilmoqda:", userData)

    // Parallel so‘rovlar
    const [crmResult, supabaseResult] = await Promise.allSettled([
      // 1. Yangi CRM
      fetch(CRM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(crmPayload),
      }),
      // 2. Supabase – huzur jadvaliga yozish
      supabase.from("huzur").insert([userData]).select("id"),
    ])

    // ─── CRM javobini tekshirish ──────────────────────
    if (crmResult.status === "fulfilled") {
      const response = crmResult.value
      const responseData = await response.json().catch(() => null)
      if (response.ok) {
        console.log("✅ CRM muvaffaqiyatli:", response.status, responseData)
      } else {
        console.error("❌ CRM xatosi:", response.status, responseData)
      }
    } else {
      console.error("❌ CRM so‘rovida xatolik:", crmResult.reason)
    }

    // ─── Supabase javobini tekshirish ─────────────────
    if (supabaseResult.status === "fulfilled") {
      const { data, error } = supabaseResult.value
      if (error) {
        console.error("❌ Supabase xatosi:", error.message)
      } else {
        console.log("✅ Supabase huzur, id:", data?.[0]?.id)
      }
    } else {
      console.error("❌ Supabase so‘rovida xatolik:", supabaseResult.reason)
    }

    // Frontga doim muvaffaqiyatli javob (fire-and-forget)
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error("💥 Server kutilmagan xatolik:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}