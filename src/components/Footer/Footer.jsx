// icon components
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaRegCopyright,
} from "react-icons/fa";

const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0F1114] border-t border-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Creator info */}
        <div className="flex flex-col items-center md:items-start text-sm text-gray-500">
          <p className="font-medium text-gray-400">
            Created by{" "}
            <span className="text-white font-bold">Vishnu Prasad SV</span>
          </p>
          <div className="flex items-center gap-1 mt-1">
            <FaRegCopyright size={12} />
            <span>{currentYear} Vortix. All rights reserved.</span>
          </div>
        </div>

        {/* Social media links */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-gray-400 hover:text-[#FF5F1F] transition-colors duration-300 transform hover:scale-110"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#FF5F1F] transition-colors duration-300 transform hover:scale-110"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#FF5F1F] transition-colors duration-300 transform hover:scale-110"
          >
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
