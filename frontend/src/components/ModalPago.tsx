import { useState } from 'react';
import { X, CreditCard, User, Phone, Loader2, Upload, ImageIcon } from 'lucide-react';
import { Notification, NotificationType } from './Notification';

interface ModalPagoProps {
  boletaNumero: string;
  onClose: () => void;
  onConfirmar: (nombre: string, telefono: string, comprobante?: File) => Promise<any>;
}

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

export const ModalPago = ({ boletaNumero, onClose, onConfirmar }: ModalPagoProps) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    message: ''
  });

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
  };

  const hideNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Por favor selecciona un archivo de imagen válido');
        return;
      }
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'La imagen no debe superar los 5MB');
        return;
      }
      setComprobante(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !telefono.trim()) {
      showNotification('warning', 'Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await onConfirmar(nombre, telefono, comprobante || undefined);
      showNotification('success', '¡Boleta reservada exitosamente! Recibirás confirmación cuando se verifique el pago.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Error al procesar la reserva. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full flex flex-col animate-scale-in max-h-[100vh] sm:max-h-[95vh] overflow-hidden">
        {/* Header con gradiente vibrante */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 px-4 sm:px-6 py-4 sm:py-6 text-white relative overflow-hidden flex-shrink-0">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-black">
                  Boleta #{boletaNumero}
                </h2>
              </div>
              <p className="text-white/90 text-xs sm:text-sm">Completa tu compra</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 duration-300"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white overflow-y-auto flex-1">
          {/* Info de precio */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-bold text-sm sm:text-base lg:text-lg">Precio total</span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">$20.000</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Campo Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-gray-700 font-semibold text-sm mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  Nombre completo <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                placeholder="Tu nombre completo"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-gray-700 font-semibold text-sm mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                  Número de teléfono <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                placeholder="3001234567"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Comprobante (opcional) */}
            <div>
              <label htmlFor="comprobante" className="block text-gray-700 font-semibold text-sm mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  Comprobante de pago <span className="text-gray-500 text-xs font-normal">(opcional)</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="comprobante"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="comprobante"
                  className={`
                    w-full px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-xl
                    flex items-center justify-center gap-2 sm:gap-3 cursor-pointer
                    hover:from-purple-100 hover:to-pink-100 hover:border-purple-500 transition-all
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {comprobante ? (
                    <>
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                        {comprobante.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-600">
                        Click para adjuntar captura del pago
                      </span>
                    </>
                  )}
                </label>
              </div>
              {comprobante && (
                <button
                  type="button"
                  onClick={() => setComprobante(null)}
                  className="text-xs text-red-500 hover:text-red-600 mt-2 font-medium transition-colors"
                  disabled={loading}
                >
                  Eliminar archivo
                </button>
              )}
            </div>

            {/* Info adicional */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-r-xl">
              <p className="text-xs sm:text-xs text-blue-800 leading-relaxed">
                <strong>Importante:</strong> Si adjuntas el comprobante, tu boleta se marcará como <strong className="text-green-600">comprada</strong>. Sin comprobante quedará <strong className="text-yellow-600">reservada</strong> temporalmente.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm sm:text-base font-semibold transition-all"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:from-purple-700 hover:via-pink-600 hover:to-red-600 text-white rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notificación */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};
