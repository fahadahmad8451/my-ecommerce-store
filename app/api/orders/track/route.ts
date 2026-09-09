import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Order tracking is not connected yet. Please contact support for an update." }, { status: 501 });
}
