"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          background: "#080c14",
          color: "#e2e8f0",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 16px",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            ⚠️ 出错了
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            页面发生意外错误，请刷新重试。
          </p>
          <button
            onClick={reset}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(6, 182, 212, 0.15)",
              color: "#22d3ee",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
