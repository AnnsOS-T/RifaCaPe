import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Clock, User, Phone, Hash, Calendar, Image as ImageIcon, XCircle, Check, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import axios from 'axios';
import { boletaService } from '../services/api';

interface BoletaAdmin {
  _id: string;
  numero: number;
  estado: 'disponible' | 'reservada' | 'pagada';
  usuario?: {
    nombre: string;
    telefono: string;
  };
  comprobanteUrl?: string;
  reservadaHasta?: string;
  createdAt: string;
  updatedAt: string;
}

export const AdminPage = () => {
  const { secretKey } = useParams<{ secretKey: string }>();
  const navigate = useNavigate();
  const [boletas, setBoletas] = useState<BoletaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [comprobanteModal, setComprobanteModal] = useState<string | null>(null);
  const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false);
  const [numeroGanador, setNumeroGanador] = useState('');
  const [errorFinalizar, setErrorFinalizar] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    cargarBoletasAdmin();
  }, [secretKey]);

  const cargarBoletasAdmin = async () => {
    if (!secretKey) {
      setError('Código de acceso inválido');
      setLoading(false);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/boletas/admin/${secretKey}`);
      
      if (response.data.success) {
        setBoletas(response.data.data);
        setError(null);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Acceso denegado. Código incorrecto.');
      } else {
        setError('Error al cargar los datos. Intenta nuevamente.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pagada':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
            <CheckCircle className="w-3 h-3" />
            Pagada
          </span>
        );
      case 'reservada':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md">
            <Clock className="w-3 h-3" />
            Reservada
          </span>
        );
      default:
        return null;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarcarPagada = async (numero: number) => {
    if (!secretKey) return;
    
    setProcesando(numero);
    try {
      await boletaService.marcarComoPagada(numero, secretKey);
      await cargarBoletasAdmin();
    } catch (err) {
      alert('Error al marcar como pagada');
      console.error(err);
    } finally {
      setProcesando(null);
    }
  };

  const handleLiberarReserva = async (numero: number) => {
    if (!secretKey) return;
    if (!confirm(`¿Estás seguro de liberar la boleta #${numero}?`)) return;
    
    setProcesando(numero);
    try {
      await boletaService.liberarReserva(numero, secretKey);
      await cargarBoletasAdmin();
    } catch (err) {
      alert('Error al liberar reserva');
      console.error(err);
    } finally {
      setProcesando(null);
    }
  };



  const handleFinalizarSorteo = async () => {
    if (!secretKey) return;
    
    // Validar formato 00-99
    if (!/^\d{2}$/.test(numeroGanador)) {
      setErrorFinalizar('El número debe tener formato 00-99');
      return;
    }

    setFinalizando(true);
    try {
      await boletaService.finalizarSorteo(secretKey, numeroGanador);
      // Redirigir a la página principal que ahora mostrará los resultados
      window.location.href = '/';
    } catch (err: any) {
      setErrorFinalizar(err.response?.data?.message || 'Error al finalizar sorteo');
      console.error(err);
    } finally {
      setFinalizando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-800 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg"
          >
            Volver al inicio
          </button>
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

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">Panel Administrativo</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 drop-shadow-2xl">
              Gestión de Boletas
            </h1>
            <p className="text-white/80">
              Controla todas las ventas y reservas
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold whitespace-nowrap">Boletas Pagadas</p>
              </div>
              <p className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 text-center">
                {boletas.filter(b => b.estado === 'pagada').length}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-1.5 rounded-lg flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-semibold whitespace-nowrap">Boletas Reservadas</p>
              </div>
              <p className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500 text-center">
                {boletas.filter(b => b.estado === 'reservada').length}
              </p>
            </div>
          </div>

          {/* Tabla de boletas */}
          {boletas.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center shadow-2xl">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No hay boletas vendidas o reservadas aún</p>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Comprobante
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {boletas.map((boleta) => (
                    <tr key={boleta._id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-gray-900">{boleta.numero}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getEstadoBadge(boleta.estado)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900">{boleta.usuario?.nombre || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900">{boleta.usuario?.telefono || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {boleta.comprobanteUrl ? (
                          <button
                            onClick={() => setComprobanteModal(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${boleta.comprobanteUrl}`)}
                            className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1 font-semibold"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Ver
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm">Sin comprobante</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-800 text-sm">
                            {formatearFecha(boleta.updatedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {boleta.estado === 'reservada' && (
                            <button
                              onClick={() => handleMarcarPagada(boleta.numero)}
                              disabled={procesando === boleta.numero}
                              className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-1 shadow-md"
                            >
                              <Check className="w-3 h-3" />
                              Pagada
                            </button>
                          )}
                          <button
                            onClick={() => handleLiberarReserva(boleta.numero)}
                            disabled={procesando === boleta.numero}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-1 shadow-md"
                          >
                            <XCircle className="w-3 h-3" />
                            Liberar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {boletas.map((boleta) => (
                <div key={boleta._id} className="p-4 hover:bg-purple-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-gray-900 text-lg">#{boleta.numero}</span>
                    </div>
                    {getEstadoBadge(boleta.estado)}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{boleta.usuario?.nombre || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{boleta.usuario?.telefono || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-800">{formatearFecha(boleta.updatedAt)}</span>
                    </div>

                    {boleta.comprobanteUrl && (
                      <button
                        onClick={() => setComprobanteModal(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${boleta.comprobanteUrl}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Ver comprobante
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {boleta.estado === 'reservada' && (
                      <button
                        onClick={() => handleMarcarPagada(boleta.numero)}
                        disabled={procesando === boleta.numero}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-1 shadow-md"
                      >
                        <Check className="w-3 h-3" />
                        Marcar Pagada
                      </button>
                    )}
                    <button
                      onClick={() => handleLiberarReserva(boleta.numero)}
                      disabled={procesando === boleta.numero}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-1 shadow-md"
                    >
                      <XCircle className="w-3 h-3" />
                      Liberar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Comprobante */}
        {comprobanteModal && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setComprobanteModal(null)}
          >
            <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setComprobanteModal(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <XCircle className="w-8 h-8" />
              </button>
              <img 
                src={comprobanteModal} 
                alt="Comprobante de pago" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => setMostrarModalFinalizar(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-6 py-3 transition-all hover:scale-105 font-bold shadow-lg"
          >
            <Trophy className="w-5 h-5" />
             Terminar el Sorteo
          </button>
          
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full px-6 py-3 transition-all hover:scale-105 font-semibold shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Modal Finalizar Sorteo */}
        {mostrarModalFinalizar && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !finalizando && setMostrarModalFinalizar(false)}
          >
            <div 
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  Finalizar Sorteo
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Al confirmar, la página principal mostrará únicamente los resultados del sorteo. 
                    Los usuarios no podrán comprar más boletas.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-900 font-bold mb-2">
                    Número Ganador (00-99)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={numeroGanador}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // Solo dígitos
                      setNumeroGanador(val);
                      setErrorFinalizar(null);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-2xl font-bold"
                    disabled={finalizando}
                  />
                </div>

                {errorFinalizar && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3">
                    <p className="text-red-600 text-sm font-semibold text-center">
                      {errorFinalizar}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarModalFinalizar(false)}
                  disabled={finalizando}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-6 py-3 font-bold transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalizarSorteo}
                  disabled={finalizando || !numeroGanador}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-6 py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {finalizando ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finalizando...
                    </span>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};
