import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, User, Trophy, Sparkles, Home } from 'lucide-react';

interface BoletaResultado {
  numero: string;
  estado: 'reservada' | 'pagada';
  nombreCensurado: string;
  fechaCompra: string;
}

export const EjemploResultadosPage = () => {
  const navigate = useNavigate();

  // Datos artificiales de ejemplo
  const numeroGanador = "42";
  const numeroLoteriaCompleto = "3842";
  const fechaFinalizacion = "2025-12-27T22:00:00";
  
  const boletas: BoletaResultado[] = [
    { numero: "01", estado: "pagada", nombreCensurado: "Ra*** Pe***", fechaCompra: "2025-12-10T10:15:00" },
    { numero: "07", estado: "pagada", nombreCensurado: "Ju*** He***", fechaCompra: "2025-12-11T16:42:00" },
    { numero: "12", estado: "reservada", nombreCensurado: "Fe*** Mo***", fechaCompra: "2025-12-14T12:00:00" },
    { numero: "15", estado: "pagada", nombreCensurado: "An*** Go***", fechaCompra: "2025-12-12T09:30:00" },
    { numero: "23", estado: "pagada", nombreCensurado: "Lu*** Sá***", fechaCompra: "2025-12-13T11:20:00" },
    { numero: "34", estado: "reservada", nombreCensurado: "Cl*** Ri***", fechaCompra: "2025-12-15T15:30:00" },
    { numero: "42", estado: "pagada", nombreCensurado: "Ma*** Ro***", fechaCompra: "2025-12-15T14:23:00" },
    { numero: "58", estado: "pagada", nombreCensurado: "Jo*** Me***", fechaCompra: "2025-12-16T08:45:00" },
    { numero: "67", estado: "pagada", nombreCensurado: "So*** Vá***", fechaCompra: "2025-12-17T13:15:00" },
    { numero: "89", estado: "pagada", nombreCensurado: "Pa*** Ca***", fechaCompra: "2025-12-18T17:00:00" }
  ];
  
  const boletaGanadora = boletas.find(b => b.numero === numeroGanador) || null;

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === 'pagada') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
          <CheckCircle className="w-3 h-3" />
          Pagada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md">
        <Clock className="w-3 h-3" />
        Reservada
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Botón Volver */}
          <div className="mb-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent backdrop-blur-md hover:bg-white/30 text-white rounded-full font-semibold transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-transparent backdrop-blur-md px-4 py-2 rounded-full mb-4">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">Resultados de Ejemplo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 drop-shadow-2xl">
              {numeroGanador ? 'Resultados del Sorteo' : 'Boletas Vendidas'}
            </h1>
            {fechaFinalizacion && (
              <p className="text-white/80">
                Sorteo finalizado el {formatearFecha(fechaFinalizacion)}
              </p>
            )}
          </div>

          {/* Tarjeta del Ganador */}
          {numeroGanador && (
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-8 mb-8 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-center">
                <Trophy className="w-20 h-20 text-white mx-auto mb-4 animate-pulse" />
                
                {/* Número completo de lotería */}
                {numeroLoteriaCompleto && (
                  <div className="mb-6">
                    <p className="text-white/90 text-sm sm:text-base font-semibold mb-2">
                      Número de Lotería de Boyacá:
                    </p>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 inline-block mb-2">
                      <p className="text-3xl sm:text-5xl font-black text-white">
                        {numeroLoteriaCompleto}
                      </p>
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm font-medium">
                      Se gana con los 2 últimos dígitos
                    </p>
                  </div>
                )}
                
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                   ¡NÚMERO GANADOR! 
                </h2>
                <div className="bg-white rounded-2xl px-8 py-6 inline-block mb-4">
                  <div className="text-6xl sm:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">
                    #{numeroGanador}
                  </div>
                </div>
                
                {boletaGanadora ? (
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">
                    <h3 className="text-white font-bold mb-3 text-xl">Datos del Ganador</h3>
                    <div className="space-y-2 text-white">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Comprador:</span>
                        <span className="font-mono">{boletaGanadora.nombreCensurado}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Estado:</span>
                        {getEstadoBadge(boletaGanadora.estado)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Fecha de compra:</span>
                        <span className="text-sm">{formatearFecha(boletaGanadora.fechaCompra)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto">
                    <p className="text-white font-bold">Número no comprado</p>
                    <p className="text-white/80 text-sm">Esta boleta no fue vendida</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info de transparencia */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Información Protegida</h3>
                <p className="text-sm text-gray-600">
                  Por seguridad, los nombres se muestran parcialmente censurados. Cada comprador puede verificar su boleta por el número adquirido.
                  Los datos completos se mantienen seguros en nuestra base de datos.
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de resultados */}
          {boletas.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center shadow-2xl">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No hay boletas vendidas aún</p>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        N° Boleta
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Comprador
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {boletas.map((boleta) => (
                      <tr 
                        key={boleta.numero} 
                        className={`hover:bg-purple-50/50 transition-colors ${
                          boleta.numero === numeroGanador ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 shadow-lg' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-lg">#{boleta.numero}</span>
                            {boleta.numero === numeroGanador && (
                              <Trophy className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-900 font-medium">{boleta.nombreCensurado}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getEstadoBadge(boleta.estado)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-800 text-sm">{formatearFecha(boleta.fechaCompra)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {boletas.map((boleta) => (
                  <div 
                    key={boleta.numero} 
                    className={`p-4 hover:bg-purple-50/50 transition-colors ${
                      boleta.numero === numeroGanador ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">#{boleta.numero}</span>
                        {boleta.numero === numeroGanador && (
                          <Trophy className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      {getEstadoBadge(boleta.estado)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900 font-medium">{boleta.nombreCensurado}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-800">{formatearFecha(boleta.fechaCompra)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
