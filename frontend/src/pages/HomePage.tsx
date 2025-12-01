import { useState, useEffect } from 'react';
import { Loader2, Info, X, Sparkles, Trophy, Calendar } from 'lucide-react';
import { Boleta } from '../types';
import { boletaService } from '../services/api';
import { BoletaItem } from '../components/BoletaItem';
import { ModalPago } from '../components/ModalPago';

export const HomePage = () => {
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState<number | null>(null);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      const boletasData = await boletaService.obtenerBoletas();
      setBoletas(boletasData);
      setError(null);
    } catch (err) {
      setError('Error al cargar las boletas. Por favor, intenta nuevamente.');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarBoleta = (numero: number) => {
    setBoletaSeleccionada(numero);
  };

  const handleCerrarModal = () => {
    setBoletaSeleccionada(null);
  };

  const handleConfirmarPago = async (nombre: string, telefono: string, comprobante?: File) => {
    if (!boletaSeleccionada) return;

    try {
      await boletaService.reservarBoleta(
        boletaSeleccionada, 
        { nombre, telefono },
        comprobante
      );
      await cargarDatos();
      return { success: true };
    } catch (err: any) {
      console.error('Error:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Cargando boletas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header con título y premio */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">Participa y Gana</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400">
                SUPER RIFA
              </span>
            </h1>
            
            <div className="bg-white rounded-3xl px-8 py-6 inline-block shadow-2xl transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span className="text-gray-600 text-lg font-semibold">Premio Mayor</span>
              </div>
              <div className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                $1.000.000
              </div>
            </div>
          </div>

          {/* Botón de información flotante */}
          <button
            onClick={() => setMostrarInfo(!mostrarInfo)}
            className="fixed top-4 right-4 bg-white text-purple-600 rounded-full px-4 py-3 shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center gap-2 z-50"
            aria-label="Información de compra"
          >
            <Info className="w-5 h-5" />
            <span className="text-sm font-bold">¿Cómo participar?</span>
          </button>

          {/* Modal de instrucciones */}
          {mostrarInfo && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
                <button
                  onClick={() => setMostrarInfo(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  Instrucciones
                </h3>
                
                <div className="space-y-4 text-gray-700">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 mb-1">Selecciona tu número</p>
                      <p className="text-sm">Escoge una boleta disponible del tablero</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 mb-1">Completa el formulario</p>
                      <p className="text-sm">Ingresa tu nombre y teléfono</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 mb-1">Realiza el pago</p>
                      <p className="text-sm">Transfiere a <span className="font-bold">3105572015</span> (Dilan Acuña)</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 mb-1">Sube el comprobante</p>
                      <p className="text-sm">
                        Con comprobante: <span className="text-green-600 font-semibold">Comprada</span> | 
                        Sin comprobante: <span className="text-yellow-600 font-semibold">Reservada</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm">
                    Sorteo: <strong className="text-purple-600">20 Diciembre 2025</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6">
              <div className="bg-red-500 text-white px-4 py-3 rounded-2xl shadow-lg">
                {error}
              </div>
            </div>
          )}

          {/* Card principal con las boletas */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona tu número</h2>
              <p className="text-gray-600">Cada boleta cuesta <span className="font-bold text-purple-600">$20.000</span></p>
            </div>

            {/* Grid de Boletas */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6">
              <div className="grid grid-cols-10 gap-1 sm:gap-2">
                {boletas.map((boleta) => (
                  <BoletaItem
                    key={boleta._id}
                    boleta={boleta}
                    onSelect={handleSeleccionarBoleta}
                  />
                ))}
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span className="text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded"></div>
                <span className="text-gray-600">Reservada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded"></div>
                <span className="text-gray-600">Pagada</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 inline-block">
              <p className="text-white text-sm mb-2">Información del sorteo</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-white">
                <div>
                  <p className="text-xs opacity-80">Fecha del sorteo</p>
                  <p className="font-bold">20 de Diciembre 2025</p>
                </div>
                <div className="hidden sm:block w-px bg-white/30"></div>
                <div>
                  <p className="text-xs opacity-80">Lotería</p>
                  <p className="font-bold">Boyacá (Sorteo 4603)</p>
                </div>
                <div className="hidden sm:block w-px bg-white/30"></div>
                <div>
                  <p className="text-xs opacity-80">Contacto</p>
                  <p className="font-bold">3105572015</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {boletaSeleccionada && (
        <ModalPago
          boletaNumero={boletaSeleccionada}
          onClose={handleCerrarModal}
          onConfirmar={handleConfirmarPago}
        />
      )}
    </div>
  );
};
