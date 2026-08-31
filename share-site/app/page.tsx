import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "熬夜波比 · 产品体验",
  description: "把重复沟通交给小程序，把时间留给真正的咨询。",
};

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <meta httpEquiv="refresh" content="0; url=/prototype/index.html#/student-home" />
      <a href="/prototype/index.html#/student-home">打开熬夜波比产品原型</a>
    </main>
  );
}
