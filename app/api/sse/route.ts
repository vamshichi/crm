// import { NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "../auth/[...nextauth]/route"

// const prisma = new PrismaClient()

// export async function GET(request: Request) {
// //   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const { searchParams } = new URL(request.url)
//   const category = searchParams.get("category")

//   if (!category) {
//     return NextResponse.json({ error: "Category is required" }, { status: 400 })
//   }

//   const encoder = new TextEncoder()
//   const stream = new ReadableStream({
//     async start(controller) {
//       const sendEvent = (data: any) => {
//         controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
//       }

//       const interval = setInterval(async () => {
//         try {
//           const leads = await prisma.lead.findMany({
//             where: { category },
//             orderBy: { updatedAt: "desc" },
//             take: 10,
//           })
//           sendEvent({ type: "leads", data: leads })

//           const salesTargets = await prisma.salesTarget.findMany({
//             where: { category },
//           })
//           sendEvent({ type: "salesTargets", data: salesTargets })
//         } catch (error) {
//           console.error("Error fetching data for SSE:", error)
//           sendEvent({ type: "error", message: "Error fetching data" })
//         }
//       }, 5000) // Send updates every 5 seconds

//       // Clean up the interval when the client disconnects
//       request.signal.addEventListener("abort", () => {
//         clearInterval(interval)
//       })
//     },
//   })

//   return new NextResponse(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   })
// }

