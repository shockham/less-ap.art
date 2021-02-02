import { Import, useDeno } from "https://deno.land/x/aleph/mod.ts";
import React, { useEffect, useRef, useState } from "https://esm.sh/react";
import Logo from "../components/logo.tsx";
import Canvas from "../components/Three.tsx";

export default function Home() {
  const [count, setCount] = useState(5);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://ws.less-ap.art/echo");
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setCount(message);
    };
  }, []);

  return (
    <div className="page">
      <Import from="../style/index.less" />
      <Canvas count={count} />
    </div>
  );
}
