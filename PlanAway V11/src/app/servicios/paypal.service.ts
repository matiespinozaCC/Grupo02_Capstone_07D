import { Injectable } from '@angular/core';
import { loadScript } from '@paypal/paypal-js'; // Asegúrate de que esta línea es correcta

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  private paypal: any;

  constructor() {}

  async initPayPal() {
    this.paypal = await loadScript({ clientId: "AcJrGcETvb-rn2-2P-NgusJXbVexMAN2a1Af14sWpE79yKaDfD0z-BS28OIr4Ynt80kSx0J5OY_rxjFf" }); // Usa tu Client ID
  }

  async iniciarPago(total: number) {
    if (!this.paypal) {
      await this.initPayPal();
    }

    return new Promise<boolean>((resolve) => {
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
          await actions.order.capture(); // Captura el pago
          resolve(true);
        },
        onCancel: () => {
          resolve(false); // El pago fue cancelado
        },
        onError: (err: any) => {
          console.error('Error en el pago:', err);
          resolve(false); // Error en el pago
        }
      }).render('#paypal-button-container'); // Asegúrate de tener este contenedor en tu HTML
    });
  }
}
