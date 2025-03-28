import React, { useEffect, useRef } from "react";

const ImmersiveTransition = ({ onFinish }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const startTime = useRef(null);
  const isUnmasking = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 20;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const requestFullscreen = () => {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) docElm.requestFullscreen().catch(() => {});
    };

    const draw = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;

      // 背景黑幕渐隐
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // 雨滴
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.5 ? "0" : "1";
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }

      // 遮罩逻辑
      if (!isUnmasking.current) {
        const coverProgress = Math.min(1, elapsed / 1500);
        ctx.fillStyle = `rgba(0, 0, 0, ${coverProgress})`;
        ctx.fillRect(0, 0, width, height);
        if (coverProgress === 1) {
          requestFullscreen();
          isUnmasking.current = true;
          startTime.current = timestamp;
        }
      } else {
        const revealProgress = Math.min(1, (timestamp - startTime.current) / 1200);
        const revealY = height * revealProgress;
        ctx.save();
        ctx.globalAlpha = 1 - revealProgress;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height - revealY);
        ctx.restore();

        if (revealProgress === 1) {
          cancelAnimationFrame(animationFrameId.current);
          onFinish?.();
          return;
        }
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    animationFrameId.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [onFinish]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        backgroundColor: "black",
      }}
    />
  );
};

export default ImmersiveTransition;
