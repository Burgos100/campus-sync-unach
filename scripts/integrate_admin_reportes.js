const fs = require('fs');
let content = fs.readFileSync('admin_reportes_main.html', 'utf-8');

// The main container
const errorBlock = `
<div *ngIf="error" class="bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium border border-error/20 flex items-center gap-2 mb-6">
  <span class="material-symbols-outlined">error</span>
  <span>{{ error }}</span>
</div>
`;

content = content.replace(/(<!-- Central Call to Action Section -->)/, errorBlock + '$1');

// Report generation button
content = content.replace(/id="generate-btn" onclick="simulateGeneration\(\)"/, `(click)="generarReporte()"`);

// Hide the generation center section when loading or generated
content = content.replace(/(<div class="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col min-h-\[500px\] relative">)/, 
  `$1
  <div *ngIf="!reporteGenerado && !loading" class="flex-1 flex flex-col h-full w-full absolute inset-0">`);

content = content.replace(/(<!-- Progress Bar \(Hidden initially\) -->[\s\S]*?<\/div>)\n<\/div>/, 
  `$1\n</div>\n</div>`);

// Inject loading state
content = content.replace(/(<!-- Card Footer Info -->)/, `
  <div *ngIf="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-lowest z-20">
    <div class="w-24 h-24 mb-6 rounded-full border-4 border-surface-container-high border-t-primary animate-spin"></div>
    <p class="text-headline-md font-bold text-primary animate-pulse">Analizando datos y generando reporte con IA...</p>
  </div>

  <div *ngIf="reporteGenerado && !loading" class="absolute inset-0 bg-surface-container-lowest z-20 p-8 md:p-12 overflow-y-auto flex flex-col">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant">
      <h3 class="text-headline-md font-bold text-on-surface flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">analytics</span> Resumen Ejecutivo Generado
      </h3>
      <button (click)="generarReporte()" class="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-label-sm hover:bg-primary/20 transition-colors">Generar Nuevo</button>
    </div>
    <div class="prose max-w-none text-on-surface-variant flex-1 overflow-y-auto custom-scrollbar pr-2">
      <p class="whitespace-pre-wrap text-body-md">{{ reporteGenerado }}</p>
    </div>
  </div>
$1`);


fs.writeFileSync('frontend/src/app/components/admin-reportes/admin-reportes.component.html', content);
console.log('admin-reportes done');
