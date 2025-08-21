import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      console.log("Invalid wallet address:", walletAddress);
      return NextResponse.json({ success: false, error: "Invalid wallet address" }, { status: 400 });
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set("walletAddress", walletAddress, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });
    console.log(`Set wallet address cookie: ${walletAddress}`);
    return response;
  } catch (e) {
    console.error("Error setting wallet address:", e);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}