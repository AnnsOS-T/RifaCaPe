import { useState, useEffect } from 'react';
import { Loader2, Info, X, Sparkles, Calendar, Trophy } from 'lucide-react';
import { Boleta } from '../types';
import { boletaService } from '../services/api';
import { BoletaItem } from '../components/BoletaItem';
import { ModalPago } from '../components/ModalPago';
import { ResultadosPage } from './ResultadosPage';

export const HomePage = () => {
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState<string | null>(null);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorteoFinalizado, setSorteoFinalizado] = useState(false);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      // Verificar estado del sorteo primero
      const sorteoData = await boletaService.verificarSorteo();
      setSorteoFinalizado(sorteoData.finalizado);
      
      if (!sorteoData.finalizado) {
        const boletasData = await boletaService.obtenerBoletas();
        setBoletas(boletasData);
      }
      setError(null);
    } catch (err) {
      setError('Error al cargar las boletas. Por favor, intenta nuevamente.');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarBoleta = (numero: string) => {
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

  // Si el sorteo está finalizado, mostrar resultados
  if (sorteoFinalizado) {
    return <ResultadosPage />;
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
        <div className="max-w-xl mx-auto">
          {/* Header con título y premio */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-10 mb-4">
              {/* Spacer */}
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400">
                SUPER RIFA
              </span>
            </h1>
            
            <div className="bg-white rounded-3xl px-8 py-4 inline-block shadow-2xl transform hover:scale-105 transition-transform">
              <div  className="flex items-center justify-center gap-3 mb-1">
                <Trophy className="text-yellow-600 text-lg font-semibold" />
                <span className="text-gray-600 text-lg font-semibold">Premio Mayor</span>   
              </div>
              <div className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-center">
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full relative shadow-2xl max-h-[100vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
                <button
                  onClick={() => setMostrarInfo(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 pr-8">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
                    Instrucciones
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 text-gray-700">
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Selecciona tu número</p>
                      <p className="text-xs sm:text-sm">Escoge una boleta disponible del tablero</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Completa el formulario</p>
                      <p className="text-xs sm:text-sm">Ingresa tu nombre y teléfono</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Realiza el pago</p>
                      <p className="text-xs sm:text-sm">Transfiere a <span className="font-bold">314 4279907</span> (Caryn Peralta)</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1 text-sm sm:text-base">Sube el comprobante</p>
                      <p className="text-xs sm:text-sm">
                        Con comprobante: <span className="text-green-600 font-semibold">Comprada</span> | 
                        Sin comprobante: <span className="text-yellow-600 font-semibold">Reservada</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-green-800 mb-1 text-xs sm:text-sm"> Seguridad Garantizada</p>
                        <p className="text-[11px] sm:text-xs text-green-700 leading-relaxed">
                          Todos tus datos están protegidos en nuestra base de datos. No habrá cambios ni errores en la información de compra. 
                          Al finalizar el sorteo, la pagina mostrará ciertos datos de hora, fecha y comprador de cada número para total transparencia.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <p className="text-xs sm:text-sm">
                      Sorteo: <strong className="text-purple-600">27 Diciembre 2025</strong>
                    </p>
                  </div>
                </div>
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
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona tu número</h2>
              <p className="text-gray-600">Cada boleta cuesta <span className="font-bold text-purple-600">$20.000</span></p>
            </div>

            {/* Grid de Boletas */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6">
              <div className="grid grid-cols-10 gap-0.5 sm:gap-0.5 auto-rows-fr">
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
        </div>

        {/* Footer */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 inline-block">
            <p className="text-white text-sm mb-2">Información del sorteo</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-white items-center">
              <div className="flex items-center gap-2">
                <p className="text-xs opacity-80">Fecha del sorteo:</p>
                <p className="font-bold whitespace-nowrap">27 de Diciembre 2025</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <p className="text-xs opacity-80">Lotería:</p>
                <p className="font-bold whitespace-nowrap">Boyacá (Sorteo 4604)</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/30"></div>
              <div className="flex items-start gap-2">
                <p className="text-xs opacity-80 mt-0.5">Contacto:</p>
                <div>
                  <p className="font-bold whitespace-nowrap">314 4279907</p>
                  <p className="text-[10px] opacity-70">Caryn Peralta</p>
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
