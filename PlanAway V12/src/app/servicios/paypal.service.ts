import { Injectable } from '@angular/core';
import { loadScript } from '@paypal/paypal-js'; // Asegúrate de que esta línea es correcta

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  private paypal: any;

  constructor() {}

  // Cargar el SDK de PayPal con manejo de errores
  async initPayPal() {
    try {
      this.paypal = await loadScript({
        clientId: 'AcJrGcETvb-rn2-2P-NgusJXbVexMAN2a1Af14sWpE79yKaDfD0z-BS28OIr4Ynt80kSx0J5OY_rxjFf'
      });

      if (!this.paypal) {
        throw new Error('No se pudo cargar el SDK de PayPal.');
      }
    } catch (error) {
      console.error('Error al cargar el SDK de PayPal:', error);
      throw error;  // Re-throw para que puedas manejarlo en el lugar donde llamas a esta función
    }
  }

  async iniciarPago(total: number) {
    if (!this.paypal) {
      console.log('El SDK de PayPal no está cargado, cargando ahora...');
      await this.initPayPal();
    }

    return new Promise<boolean>((resolve) => {
      try {
        // Asegurarse de que el botón de PayPal se renderice solo cuando el SDK esté listo
        this.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: total.toFixed(2) // Asegúrate de que sea un valor numérico válido
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            await actions.order.capture();
            resolve(true); // Pago exitoso
          },
          onCancel: () => {
            resolve(false); // El pago fue cancelado
          },
          onError: (err: any) => {
            console.error('Error en el pago:', err);
            resolve(false); // Error en el pago
          }
        }).render('#paypal-button-container'); // Asegúrate de que el contenedor esté en el DOM
      } catch (error) {
        console.error('Error al renderizar el botón de PayPal:', error);
        resolve(false);
      }
    });
  }
}
