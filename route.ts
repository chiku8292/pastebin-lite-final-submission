import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const paste = await kv.get<any>(`paste:${params.id}`);
  if (!paste) return Response.json({}, { status: 404 });

  const now = nowMs();

  if (paste.ttl_seconds && now > paste.createdAt + paste.ttl_seconds * 1000) {
    return Response.json({}, { status: 404 });
  }

  if (paste.max_views && paste.views >= paste.max_views) {
    return Response.json({}, { status: 404 });
  }

  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return Response.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.ttl_seconds
      ? new Date(paste.createdAt + paste.ttl_seconds * 1000).toISOString()
      : null
  });
}
