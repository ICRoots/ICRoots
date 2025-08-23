// src/vanta/fog.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

const VantaFog: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          highlightColor: 0x00ffd5,
          midtoneColor: 0x005577,
          lowlightColor: 0x001122,
          baseColor: 0x000000,
          blurFactor: 0.6,
          speed: 1.0,
          zoom: 0.8,
        }),
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} style={{ width: "100%", height: "100vh" }} />;
};

export default VantaFog;
