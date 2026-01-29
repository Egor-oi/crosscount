export default async function Home() {
  // В Vercel лучше обращаться относительным путём
  const res = await fetch(`/api/metrics`, { cache: "no-store" });
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = { error: "Failed to parse response" };
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>CrossCount</h1>
      <p style={{ opacity: 0.75, marginTop: 8 }}>
        Единый счётчик соцсетей: YouTube + VK (Instagram/TikTok позже)
      </p>

      {data?.error ? (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: "rgba(255,0,0,0.12)" }}>
          Ошибка: {String(data.error)}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 16,
          marginTop: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
        }}
      >
        <Card title="YouTube">
          <Row label="Подписчики" value={data?.youtube?.subscribers} />
          <Row label="Просмотры" value={data?.youtube?.views} />
          <Row label="Видео" value={data?.youtube?.videos} />
          <Small text={`Channel ID: ${data?.youtube?.channelId || "-"}`} />
        </Card>

        <Card title="VK">
          <Row label="Подписчики" value={data?.vk?.members} />
          <Small text={`Group: ${data?.vk?.groupId || "-"}`} />
        </Card>

        <Card title="Instagram">
          <Small text={data?.instagram?.status || "not_connected"} />
        </Card>

        <Card title="TikTok">
          <Small text={data?.tiktok?.status || "not_connected"} />
        </Card>
      </div>

      <div style={{ marginTop: 18, opacity: 0.65, fontSize: 12 }}>
        Updated: {data?.updatedAt || "-"}
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: 16,
        background: "rgba(255,255,255,0.04)"
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ opacity: 0.75 }}>{label}</span>
      <span style={{ fontWeight: 800 }}>{value ?? "-"}</span>
    </div>
  );
}

function Small({ text }: { text: string }) {
  return <div style={{ fontSize: 12, opacity: 0.7, marginTop: 10 }}>{text}</div>;
}
