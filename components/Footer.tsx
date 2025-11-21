
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="px-[5%] py-8 text-center text-sm text-white/40 border-t border-white/10 mt-16">
      <p>&copy; {new Date().getFullYear()} EchoMasters. All Rights Reserved. Premium Ultrasound Education.</p>
    </footer>
  );
};

export default Footer;
