import React from 'react';

/**
 * Shared, intentionally restrained backdrop for the auth screens (login + MFA).
 * Enterprise-appropriate: a soft neutral gradient, two faint static corner
 * glows, a subtle dot texture, and a gentle halo to lift the card off the
 * surface. No motion, no loud color — purely decorative behind the z-10 card.
 */
const LoginBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Faint cool tint layers in opposite corners for quiet depth */}
      <div className="absolute -top-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full bg-blue-200/30 blur-[120px]" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[55vw] h-[55vw] rounded-full bg-indigo-200/25 blur-[130px]" />

      {/* Soft halo behind the card so it lifts off the surface */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1300px] h-[75vh] bg-white/50 rounded-[80px] blur-[100px]" />

      {/* Subtle dot texture, faded toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(100,116,139,0.35) 1px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)',
        }}
      />
    </div>
  );
};

export default LoginBackground;
