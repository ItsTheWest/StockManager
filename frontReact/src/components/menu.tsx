import { useState } from 'react';
import { Link } from 'react-router-dom';

interface MenuProps {
    children?: React.ReactNode;
}

export function Menu({ children }: MenuProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [inventarioOpen, setInventarioOpen] = useState(false);
    const [gestionOpen, setGestionOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    const toggleInventario = () => {
        setInventarioOpen(!inventarioOpen);
    };

    const toggleGestion = () => {
        setGestionOpen(!gestionOpen);
    };

    return (
        <>
            {/* Header / Navbar */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200  dark:border-gray-300">
                <div className="px-3 py-2 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            {/* Mobile menu button */}
                            <button
                                onClick={toggleSidebar}
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    ></path>
                                </svg>
                            </button>
                            {/* Logo */}
                            <a href="#" className="flex ms-2 gap-2 md:me-24">
                                <img src="/Logo-StockManager.png" alt="Logo" className="h-12  w-auto" />
                                <span className="self-center text-xl font-semibold sm:text-2x1 whitespace-nowrap dark:text-black">
                                    StockManager
                                </span>

                            </a>
                        </div>
                        {/* User menu */}
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={toggleUserMenu}
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                        aria-expanded={userMenuOpen}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="w-9 h-auto rounded-full"
                                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                            alt="user photo"
                                        />
                                    </button>
                                    {/* Dropdown menu */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                            <div className="px-4 py-3">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    Neil Sims
                                                </p>
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                                                    neil.sims@flowbite.com
                                                </p>
                                            </div>
                                            <ul className="py-1">
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Settings
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Earnings
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    >
                                                        Sign out
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } bg-white border-r border-gray-200 sm:translate-x-0  dark:border-gray-300`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white ">
                    <ul className="space-y-2 font-medium">
                        {/* Dashboard */}
                        <li>
                            <Link
                                to="/dashboard"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group"
                            >
                                <svg className="w-6 h-6  text-gray-500   dark:group-hover:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                                </svg>
                                <span className="ms-3 text-gray-800 font-semibold dark:group-hover:text-blue-600">Inicio</span>
                            </Link>
                        </li>
                        {/* Inventario - Dropdown */}
                        <li>
                            <button
                                type="button"
                                onClick={toggleInventario}
                                className="flex items-center cursor-pointer w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group"
                            >
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-300 dark:group-hover:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1 ms-3 text-left text-gray-800 font-semibold dark:group-hover:text-blue-600">Productos</span>
                                <svg
                                    className={`w-3 h-3 text-gray-500 transition-transform group-hover:text-blue-600 ${inventarioOpen ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {inventarioOpen && (
                                <ul className="py-2 space-y-2">
                                    <li>
                                        <Link to="/inventory" className="flex items-center w-full p-2 text-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-blue-600 dark:text-gray-600 dark:hover:bg-gray-200">
                                            Inventario
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categories" className="flex items-center w-full p-2 text-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-blue-600 dark:text-gray-600 dark:hover:bg-gray-200">
                                            Categorias
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/providers" className="flex items-center w-full p-2 text-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-blue-600 dark:text-gray-600 dark:hover:bg-gray-200">
                                            Proveedores
                                        </Link>
                                    </li>

                                </ul>
                            )}
                        </li>
                        {/* Inbox */}
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group"
                            >
                                <svg className="w-7 h-7 text-gray-500 transition duration-75 group-hover:text-gray-300 dark:group-hover:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                                </svg>
                                <span className="flex-1 ms-3 text-gray-800 font-semibold dark:group-hover:text-blue-600">Notificaciones</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-200 dark:text-red-500">
                                    2
                                </span>
                            </a>
                        </li>
                        {/* Users */}

                        <li>
                            <a

                                className="flex items-center cursor-pointer p-2 text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group"
                            >
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-300 dark:group-hover:text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.934.998V11a1 1 0 0 0 1 1h7.975a1 1 0 0 0 .998-.934l.005-.074A7.04 7.04 0 0 0 22 10.5 8.5 8.5 0 0 0 13.5 2Z" />
                                    <path d="M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z" />
                                </svg>

                                <span className="flex-1 ms-3 text-gray-800 font-semibold dark:group-hover:text-blue-600">Reportes y Estadisticas</span>
                            </a>

                        </li>

                        {/* Products */}
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings  text-gray-800 font-semibold dark:group-hover:text-blue-600"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>
                                <span className="flex-1 ms-3 text-gray-800 font-semibold dark:group-hover:text-blue-600">Configuraciones</span>
                            </a>
                        </li>
                        {/* Gestión - Dropdown */}
                        <li>
                            <button
                                type="button"
                                onClick={toggleGestion}
                                className="flex items-center cursor-pointer w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group"
                            >
                                <svg
                                    className="w-7 h-7 text-gray-500 transition duration-75 group-hover:text-gray-300 dark:group-hover:text-blue-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1 ms-3 text-left text-gray-800 font-semibold dark:group-hover:text-blue-600">Gestión</span>
                                <svg
                                    className={`w-3 h-3 text-gray-500 transition-transform group-hover:text-blue-600 ${gestionOpen ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {gestionOpen && (
                                <ul className="py-2 space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center w-full p-2 text-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-blue-600 dark:text-gray-600 dark:hover:bg-gray-200"
                                        >
                                            Usuarios
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center w-full p-2 text-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-blue-600 dark:text-gray-600 dark:hover:bg-gray-200"
                                        >
                                            Roles
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center w-full p-2 text-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 hover:text-blue-600 dark:text-gray-600 dark:hover:bg-gray-200"
                                        >
                                            Permisos
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        {/* Sign In */}
                        <li>
                            <Link to="/login" className="flex items-center p-2 text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200 group">
                                <svg
                                    className=" w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-300 dark:group-hover:text-blue-600"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                                    />
                                </svg>
                                <span className="flex-1 ms-3 text-gray-800 font-semibold dark:group-hover:text-blue-600">Cerrar Sesión</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside >

            {/* Overlay for mobile */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-gray-800 bg-opacity-50 sm:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )
            }

            {/* Main content */}
            <div className="p-4 sm:ml-64 mt-14">
                {children}
            </div>
        </>
    );
}