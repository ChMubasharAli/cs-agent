import { FaBars } from "react-icons/fa"; // Importing necessary icons

export default function Header({ setIsOpen, activeItem }) {
  return (
    <header className=" backdrop-blur-xl bg-white sticky top-0 left-0 rounded-2xl px-4 md:px-8 flex items-center justify-between h-16  md:h-20 shadow-lg   z-40">
      <div className="flex items-center justify-between w-full space-x-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-heading tracking-tight truncate">
            {activeItem || "Dashboard"}
          </h1>
          <p className="text-gray-600 text-sm font-medium mt-1 truncate hidden sm:block">
            Welcome back, Manage your {activeItem || "Dashboard"} effectively.
          </p>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-600 md:hidden block hover:text-primary transition-all duration-200 p-2 rounded-xl hover:bg-gray-100/80"
        >
          <FaBars size={20} /> {/* Replaced IconMenu2 with FaBars */}
        </button>
      </div>
    </header>
  );
}
