import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, filter, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  private deferredPrompt: any;
  private canInstallSubject = new BehaviorSubject<boolean>(false);
  
  /**
   * Observable que emite true se o app puder ser instalado (evento beforeinstallprompt disparado)
   */
  canInstall$ = this.canInstallSubject.asObservable();

  constructor() {
    this.init();
  }

  private init(): void {
    // Escuta o evento de instalação do navegador
    window.addEventListener('beforeinstallprompt', (e) => {
      // Impede que o mini-infobar do Chrome apareça automaticamente
      e.preventDefault();
      // Armazena o evento para disparar o prompt depois
      this.deferredPrompt = e;
      this.canInstallSubject.next(true);
    });

    // Escuta atualizações do Service Worker (Silent Update logic)
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map(evt => ({
            type: 'UPDATE_AVAILABLE',
            current: evt.currentVersion,
            next: evt.latestVersion
          }))
        )
        .subscribe(() => {
          // Nota: O usuário escolheu atualização silenciosa (próximo recarregamento).
          // Poderíamos mostrar um log ou uma pequena notificação discreta que não exige ação.
          console.log('MedStudy: Nova versão baixada. Será aplicada no próximo carregamento.');
        });
    }
  }

  /**
   * Dispara o prompt de instalação nativo
   */
  async install(): Promise<void> {
    if (!this.deferredPrompt) {
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.snackBar.open('MedStudy instalado com sucesso! 🎉', 'Fechar', { duration: 5000 });
      this.canInstallSubject.next(false);
    } else {
      this.snackBar.open('A instalação foi cancelada.', 'Fechar', { duration: 3000 });
    }
    
    this.deferredPrompt = null;
  }
}
