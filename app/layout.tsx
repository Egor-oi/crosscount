export const metadata = {
  title: "CrossCount",
  description: "Единый счётчик соцсетей"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, background: "#0b0b10", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
