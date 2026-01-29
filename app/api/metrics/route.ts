import { NextResponse } from "next/server";

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

async function fetchYouTube() {
  const apiKey = must("YOUTUBE_API_KEY");
  const channelId = must("YOUTUBE_CHANNEL_ID");

  const url =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=statistics&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;

  const r = await fetch(url, { next: { revalidate: 3600 } });
  if (!r.ok) return { channelId, error: `YouTube API error ${r.status}` };

  const j = await r.json();
  const stats = j?.items?.[0]?.statistics;

  return {
    channelId,
    subscribers: stats?.subscriberCount ? Number(stats.subscriberCount) : null,
    views: stats?.viewCount ? Number(stats.viewCount) : null,
    videos: stats?.videoCount ? Number(stats.videoCount) : null
  };
}

async function fetchVK() {
  const token = must("VK_TOKEN");
  const groupId = must("VK_GROUP_ID");

  const url =
    `https://api.vk.com/method/groups.getById` +
    `?group_id=${encodeURIComponent(groupId)}` +
    `&fields=members_count` +
    `&access_token=${encodeURIComponent(token)}` +
    `&v=5.199`;

  const r = await fetch(url, { next: { revalidate: 3600 } });
  const j = await r.json();

  if (j?.error) return { groupId, error: `VK API error: ${j.error.error_msg}` };

  const g = j?.response?.[0];
  return {
    groupId,
    members: typeof g?.members_count === "number" ? g.members_count : null
  };
}

export async function GET() {
  try {
    const [youtube, vk] = await Promise.all([fetchYouTube(), fetchVK()]);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      youtube,
      vk,
      instagram: { status: "not_connected" },
      tiktok: { status: "not_connected" }
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown_error", updatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
