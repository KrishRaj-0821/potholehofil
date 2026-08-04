import { NextRequest, NextResponse } from 'next/server';
import { runVisionVerificationAgent } from '@/lib/agents/visionAgent';
import { runLocalizedRoastingAgent } from '@/lib/agents/roastAgent';
import { enforceGeoSecurityAndRateLimit, syncPostToDatabase } from '@/lib/agents/geoSecurityAgent';
import { PotholePost } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, lat, lng } = body;

    const userIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Agent 4: Geo-Security & Rate Limit Verification
    const userLat = lat || 25.8452;
    const userLng = lng || 87.5341;
    const geoCheck = enforceGeoSecurityAndRateLimit(userLat, userLng, userIp);

    if (!geoCheck.allowed) {
      return NextResponse.json(
        { success: false, error: geoCheck.rejectReason },
        { status: 403 }
      );
    }

    // 2. Agent 1: Vision Verification Agent (Gemini Multimodal / Vision Engine)
    const visionResult = await runVisionVerificationAgent(imageBase64);
    if (!visionResult.isValid) {
      return NextResponse.json(
        { success: false, error: visionResult.rejectReason || 'No pothole or road surface detected in image.' },
        { status: 400 }
      );
    }

    // 3. Agent 2: Localized Meme Roasting Agent (Kasba / Purnea Dialect)
    const roast = await runLocalizedRoastingAgent(
      visionResult.potholeCount,
      visionResult.severity,
      visionResult.metrics.depthCm
    );

    // 4. Construct Final Post
    const newPost: PotholePost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'Kasba Resident',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        handle: '@kasba_reporter',
      },
      location: {
        name: 'Kasba Road, Ward 2',
        pin: '854330',
        distance: `${geoCheck.distanceKm} km away`,
        verified: true,
        lat: userLat,
        lng: userLng,
      },
      imageUrl: imageBase64,
      memeCaption: roast.caption,
      memeSubtext: roast.subtext,
      severity: visionResult.severity,
      metrics: visionResult.metrics,
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      createdAt: 'Just now',
      tags: ['Kasba854330', 'AI_Verified', 'RoadDefect'],
      userVote: 'up',
      comments: [],
    };

    // 5. Agent 4: Sync to Firebase Cloud Firestore & Storage
    await syncPostToDatabase(newPost);

    return NextResponse.json({
      success: true,
      post: newPost,
      vision: visionResult,
      roast,
    });
  } catch (err: any) {
    console.error('Process Pothole API Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal pipeline error processing pothole scan.' },
      { status: 500 }
    );
  }
}
