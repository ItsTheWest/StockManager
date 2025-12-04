import { Link, useNavigate } from "react-router-dom";


export function Login() {
  const navigate = useNavigate();

  const handleClick = () => { /* funcion para redirigir a la pagina de registro */
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* lado izquierdo - formulario */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-full">
          <div className="mb-12">
            <div className="flex items-center sm:text-2xl  gap-3 font-bold text-xl text-gray-900">
              <img src="/Logo-StockManager.png" alt="Logo" className="h-14 w-auto" />
              StockManager
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Bienvenido de nuevo</h1>
            <p className="mt-2 text-base text-gray-500">Por favor ingresa tus datos</p>
          </div>

          <button className=" cursor-pointer flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">
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
            Iniciar sesión con Google
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
              <label htmlFor="email" className="block text-base font-medium text-gray-900">
                Correo Electronico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#004cff] focus:outline-none focus:ring-1 focus:ring-[#004cff] sm:text-base"
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
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#004cff] focus:outline-none focus:ring-1 focus:ring-[#004cff] sm:text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">


              <div className="text-base">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Recuperar contraseña
                </a>
              </div>
            </div>

            <div>
              <button onClick={handleClick}
                type="submit"
                className="flex w-full justify-center rounded-lg border border-transparent bg-[#004cff] px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-[#003ed3] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-base text-gray-500">
            ¿No posees una cuenta?{' '}
            <Link to="/register">
              <a className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                Registrate
              </a>
            </Link>
          </p>
        </div>
      </div>

      {/*ladoderech - slogan*/}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-[#093fc4] overflow-hidden">

        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'linear-gradient(#5463c2 1px, transparent 1px), linear-gradient(90deg, #5463c2 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(circle at top right, black 0%, transparent 45%), radial-gradient(circle at bottom left, black 0%, transparent 45%)',
              WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 45%), radial-gradient(circle at bottom left, black 0%, transparent 45%)'
            }}
          ></div>
        </div>


        <div className="z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">StockManager</h1>
          </div>
          <p className="max-w-sm text-xl text-gray-200 font-medium">
            La plataforma de gestión de inventario que transforma los datos en crecimiento para tu negocio.
          </p>
        </div>
      </div>
    </div>
  );
}
