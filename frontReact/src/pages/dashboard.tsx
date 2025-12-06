import { Menu } from '../components/menu';

export function Dashboard() {
    return (
        <Menu>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Aquí puedes agregar el contenido de tu dashboard */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Bienvenido</h2>
                        <p className="text-gray-600">Este es tu panel de control</p>
                    </div>
                </div>
            </div>
        </Menu>
    );
}