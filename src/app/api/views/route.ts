import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

    // Increment view count in Redis
    const key = `views:drama:${slug}`;
    const views = await redis.incr(key);

    return NextResponse.json({ success: true, views });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

