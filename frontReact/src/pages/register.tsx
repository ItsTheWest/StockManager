import { Link, useNavigate } from "react-router-dom";

export function Register() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            <div className="flex w-full max-w-7xl mx-auto p-4 lg:p-8">
                {/* Left side - Info */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-8">
                    <div className="mb-8 flex items-center gap-3">
                        <img src="/Logo-StockManager.png" alt="Logo" className="h-14 w-auto" />
                        <span className="text-2xl font-bold text-gray-900">StockManager</span>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Comienza rápidamente</h3>
                                <p className="mt-1 text-gray-500">Integra tus procesos de inventario de forma sencilla y eficiente con nuestras herramientas intuitivas.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Soporte para cualquier negocio</h3>
                                <p className="mt-1 text-gray-500">Adapta la plataforma a las necesidades específicas de tu empresa, sin importar su tamaño.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Precisión y rentabilidad</h3>
                                <p className="mt-1 text-gray-500">Minimiza los errores de stock y maximiza las ganancias al tener la información correcta para cada decisión.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-6 text-base text-gray-500">
                        <a href="#" className="hover:text-gray-900">Sobre nosotros</a>
                        <a href="#" className="hover:text-gray-900">Términos y Condiciones</a>
                        <a href="#" className="hover:text-gray-900">Contacto</a>
                    </div>
                </div>

                {/* Right side - Form Card */}
                <div className="flex w-full flex-col justify-center lg:w-1/2">
                    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta gratis</h1>
                        </div>

                        <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Registrarse con Google
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-base">
                                <span className="bg-white px-2 text-gray-500"> o </span>
                            </div>
                        </div>

                        <form className="space-y-5">
                            <div>
                                <label htmlFor="companyName" className="block text-base font-medium text-gray-900">
                                    Nombre de Empresa
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#004cff] focus:outline-none focus:ring-1 focus:ring-[#004cff] sm:text-base"
                                        placeholder="Tu empresa"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-base font-medium text-gray-900">
                                    Correo Electrónico
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#004cff] focus:outline-none focus:ring-1 focus:ring-[#004cff] sm:text-base"
                                        placeholder="nombre@empresa.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-base font-medium text-gray-900">
                                    Contraseña
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#004cff] focus:outline-none focus:ring-1 focus:ring-[#004cff] sm:text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#004cff] focus:ring-[#004cff]"
                                />
                                <label htmlFor="terms" className="ml-2 block text-base text-gray-900">
                                    Acepto los <a href="#" className="font-medium text-[#004cff] hover:underline">Términos y Condiciones</a>
                                </label>
                            </div>

                            <div>
                                <button onClick={handleLoginClick}
                                    type="submit"
                                    className="flex w-full justify-center rounded-lg border border-transparent bg-[#004cff] px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-[#003ed3] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                >
                                    Crear cuenta
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-base text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login">
                                <a className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                                    Inicia sesión aquí
                                </a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}