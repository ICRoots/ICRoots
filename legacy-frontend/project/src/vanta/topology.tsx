// src/vanta/topology.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import TOPOLOGY from "vanta/dist/vanta.topology.min";

interface VantaTopologyProps {
  options?: Record<string, any>;
  className?: string;
}

const VantaTopology: React.FC<VantaTopologyProps> = ({ options = {}, className }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        TOPOLOGY({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x081b29,
          color: 0x00ffd5,
          ...options, // allow overrides
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, options]);

  return (
    <div
      ref={vantaRef}
      className={className}
      style={{ width: "100%", height: "100%" }} // now fits parent container
    />
  );
};

export default VantaTopology;
