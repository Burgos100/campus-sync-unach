const fs = require('fs');
let content = fs.readFileSync('dashboard_alumno_main.html', 'utf-8');

// Welcome message
content = content.replace(/<span class="font-semibold text-primary">Lucas Burgos<\/span>/, '<span class="font-semibold text-primary">{{ user?.name }}</span>');

// Messages
content = content.replace(/<section class="mb-10 animate-fade-in">/, `
<div *ngIf="errorMessage" class="bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium border border-error/20 flex items-center gap-2 mb-6">
  <span class="material-symbols-outlined">error</span>
  <span>{{ errorMessage }}</span>
</div>
<div *ngIf="successMessage" class="bg-tertiary/10 text-tertiary px-4 py-3 rounded-xl text-sm font-medium border border-tertiary/20 flex items-center gap-2 mb-6">
  <span>{{ successMessage }}</span>
</div>
<section class="mb-10 animate-fade-in">`);

// Replace the static grid with the dynamic one
const gridRegex = /<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">([\s\S]*?)<\/section>/;
const dynamicGrid = `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
  <div *ngFor="let act of activities" class="group bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
    <div class="relative h-48 overflow-hidden">
      <div class="w-full h-full bg-primary/10 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
        <span class="material-symbols-outlined text-6xl text-primary/30">event</span>
      </div>
      <div class="absolute top-4 left-4">
        <span class="bg-primary/90 text-white text-label-sm px-3 py-1 rounded-full backdrop-blur-md">Actividad</span>
      </div>
    </div>
    <div class="p-6 flex-grow flex flex-col">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-headline-md font-bold text-on-background">{{ act.title }}</h3>
        <span class="bg-tertiary-fixed/20 text-tertiary text-[12px] font-bold px-2 py-0.5 rounded uppercase">Nuevo</span>
      </div>
      <p class="text-body-md text-on-surface-variant line-clamp-4 mb-6">{{ act.description }}</p>
      <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <div class="flex items-center gap-2 text-secondary">
          <span class="material-symbols-outlined text-[20px]">group</span>
          <span class="text-label-sm">Cupos disp.</span>
        </div>
        <button (click)="enroll(act.id)" class="bg-primary text-white text-label-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-container active:scale-95 transition-all">
          Inscribirse
        </button>
      </div>
    </div>
  </div>
  
  <div *ngIf="activities.length === 0" class="col-span-full p-12 text-center flex flex-col items-center justify-center text-secondary bg-white rounded-2xl border border-outline-variant shadow-sm min-h-[300px]">
    <span class="material-symbols-outlined text-6xl text-outline-variant mb-4">event_busy</span>
    <p class="text-lg font-medium">Aún no hay actividades publicadas</p>
    <p class="text-sm mt-1">Vuelve más tarde para descubrir nuevos eventos.</p>
  </div>
</div>
</section>`;

content = content.replace(gridRegex, dynamicGrid);

fs.writeFileSync('frontend/src/app/components/dashboard-alumno/dashboard-alumno.component.html', content);
console.log('dashboard-alumno done');
