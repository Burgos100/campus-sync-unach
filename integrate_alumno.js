const fs = require('fs');
let content = fs.readFileSync('alumno_inscripciones_main.html', 'utf-8');

// The main grid
const gridStartRegex = /<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">([\s\S]*?)<\/div>\n<!-- Management \/ Stats Bento Section -->/;
const match = content.match(gridStartRegex);

if (match) {
    const newGrid = `
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" *ngIf="!loading && !error && inscripciones.length > 0">
  <article *ngFor="let item of inscripciones" class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
    <div>
      <div class="flex justify-between items-start mb-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary border border-blue-100 group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-3xl">developer_board</span>
        </div>
        <span *ngIf="item.attended" class="bg-tertiary/10 text-tertiary text-label-sm font-label-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' 1;">check_circle</span> Presente
        </span>
        <span *ngIf="!item.attended" class="bg-error/10 text-error text-label-sm font-label-sm px-3 py-1 rounded-full flex items-center gap-1">
          <span class="material-symbols-outlined text-xs" style="font-variation-settings: 'FILL' 1;">cancel</span> Pendiente / Ausente
        </span>
      </div>
      <h3 class="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">{{ item.title }}</h3>
      <p class="text-body-md text-secondary line-clamp-3 mb-6">{{ item.description }}</p>
    </div>
  </article>
</div>

<div *ngIf="loading" class="text-center py-12">
  <p class="text-gray-500">Cargando tus inscripciones...</p>
</div>

<div *ngIf="!loading && error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
  {{ error }}
</div>

<div *ngIf="!loading && !error && inscripciones.length === 0" class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-12 text-center flex flex-col items-center justify-center">
  <div class="bg-emerald-50 p-4 rounded-full mb-6">
    <span class="material-symbols-outlined text-4xl text-tertiary">assignment</span>
  </div>
  <h3 class="text-xl font-bold text-gray-900 mb-2">No tienes inscripciones</h3>
  <p class="text-gray-500">Aún no te has inscrito en ninguna actividad.</p>
</div>

<!-- Management / Stats Bento Section -->
`;
    content = content.replace(gridStartRegex, newGrid);
}

fs.writeFileSync('frontend/src/app/components/alumno-inscripciones/alumno-inscripciones.component.html', content);
console.log('alumno-inscripciones done');
