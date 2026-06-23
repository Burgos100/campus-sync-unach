const fs = require('fs');
let content = fs.readFileSync('dashboard_admin_main.html', 'utf-8');

// Inject error/success messages after the header card
content = content.replace(/(<div class="bg-surface-container-lowest rounded-xl p-8 mb-8 card-shadow border-l-4 border-primary">[\s\S]*?<\/div>)/, `$1
<div *ngIf="errorMessage" class="bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium border border-error/20 flex items-center gap-2 mb-6">
  <span class="material-symbols-outlined">error</span>
  <span>{{ errorMessage }}</span>
</div>
<div *ngIf="successMessage" class="bg-tertiary/10 text-tertiary px-4 py-3 rounded-xl text-sm font-medium border border-tertiary/20 flex items-center gap-2 mb-6">
  <span>{{ successMessage }}</span>
</div>
`);

// Crear Actividad Form
content = content.replace(
  '<input class="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md font-body-md" placeholder="Ej: Taller de Docker" type="text"/>',
  '<input [(ngModel)]="newActivityTitle" class="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md font-body-md" placeholder="Ej: Taller de Docker" type="text"/>'
);

content = content.replace(
  '<input class="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md font-body-md" placeholder="Ej: Introducción a contenedores" type="text"/>',
  '<input [(ngModel)]="newActivityTopic" class="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md font-body-md" placeholder="Ej: Introducción a contenedores" type="text"/>'
);

content = content.replace(
  '<button class="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-label-sm font-label-sm">\n                                    Generar\n                                </button>',
  '<button (click)="generateDescription()" class="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-label-sm font-label-sm">Generar</button>'
);

content = content.replace(
  /<div class="p-6 rounded-xl bg-surface-container-lowest border-2 border-dashed border-outline-variant\/30 min-h-\[160px\] flex items-center justify-center">[\s\S]*?<\/div>/,
  `<div class="p-6 rounded-xl bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 min-h-[160px] flex items-center justify-center relative">
    <p *ngIf="!generatedDescription" class="text-body-md font-body-md text-secondary italic opacity-60 text-center">La descripción generada por IA aparecerá aquí...</p>
    <p *ngIf="generatedDescription" class="text-body-md font-body-md text-primary">{{ generatedDescription }}</p>
  </div>`
);

content = content.replace(
  /<button class="mt-8 w-full bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-bold py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all text-headline-md">[\s\S]*?<\/button>/,
  `<button (click)="createActivity()" [disabled]="!generatedDescription || !newActivityTitle" class="mt-8 w-full bg-tertiary-fixed-dim text-on-tertiary-fixed-variant font-bold py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all text-headline-md disabled:opacity-50 disabled:cursor-not-allowed">Guardar Actividad</button>`
);

// Gestión List
const listRegex = /<div class="space-y-4 overflow-y-auto max-h-\[600px\] pr-2">([\s\S]*?)<\/div>\n<\/section>/;
const listMatch = content.match(listRegex);
if (listMatch) {
  const newList = `<div class="space-y-4 overflow-y-auto max-h-[600px] pr-2">
    <div *ngIf="activities.length === 0" class="text-center py-10 text-secondary">No hay actividades creadas.</div>
    <div *ngFor="let act of activities" class="p-6 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary/30 transition-all group">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">{{ act.title }}</h3>
          <div class="flex gap-2 mt-1">
            <span class="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">ACTIVO</span>
          </div>
        </div>
      </div>
      <p class="text-body-md font-body-md text-secondary line-clamp-3 mb-6">{{ act.description }}</p>
      <div class="flex gap-3">
        <button (click)="viewParticipants(act)" class="flex-grow bg-surface-container-lowest border border-outline-variant py-2.5 rounded-lg text-label-sm font-label-sm font-bold hover:bg-surface-variant/30 transition-all">Participantes</button>
        <button (click)="deleteActivity(act.id)" class="px-4 py-2.5 text-error font-bold text-label-sm font-label-sm hover:bg-error-container/20 rounded-lg transition-all">Eliminar</button>
      </div>
    </div>
  </div>\n</section>`;
  content = content.replace(listRegex, newList);
}

// Append Modal
const modalCode = `
  <!-- Modal Participantes -->
  <div *ngIf="selectedActivity" class="fixed inset-0 bg-on-background/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex justify-between items-center p-6 border-b border-outline-variant bg-surface-container-low">
        <div>
          <h3 class="text-headline-md font-headline-md text-on-surface">{{ selectedActivity.title }}</h3>
          <p class="text-label-sm font-label-sm text-secondary mt-1">Lista de participantes inscritos</p>
        </div>
        <button (click)="selectedActivity = null" class="text-secondary hover:text-on-surface bg-surface-variant/50 hover:bg-surface-variant rounded-full p-2 transition-colors">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="overflow-y-auto flex-grow p-0">
        <table class="w-full text-left border-collapse min-w-full">
          <thead class="sticky top-0 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
            <tr>
              <th class="py-4 px-6 font-bold text-secondary text-sm uppercase tracking-wider">Nombre</th>
              <th class="py-4 px-6 font-bold text-secondary text-sm uppercase tracking-wider">Correo</th>
              <th class="py-4 px-6 font-bold text-secondary text-sm uppercase tracking-wider">Estado</th>
              <th class="py-4 px-6 font-bold text-secondary text-sm uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/30">
            <tr *ngFor="let p of participants" class="hover:bg-primary/5 transition-colors">
              <td class="py-4 px-6 text-on-surface font-medium">{{ p.name }}</td>
              <td class="py-4 px-6 text-secondary text-sm">{{ p.email }}</td>
              <td class="py-4 px-6">
                <span class="px-3 py-1 rounded-full text-xs font-bold" [class]="p.attended ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'">
                  {{ p.attended ? 'Presente' : 'Ausente' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <button (click)="toggleAttendance(p.enrollment_id, p.attended)" class="bg-surface-container-lowest border border-outline-variant shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors">
                  Marcar {{ p.attended ? 'Ausente' : 'Presente' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="participants.length === 0">
              <td colspan="4" class="py-12 px-6 text-center text-secondary">No hay participantes inscritos aún.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-6 bg-surface-container-low border-t border-outline-variant text-right rounded-b-2xl">
        <button (click)="selectedActivity = null" class="bg-surface-container-lowest border border-outline-variant text-on-surface px-6 py-2 rounded-xl text-sm font-bold hover:bg-surface-container transition-colors">Cerrar</button>
      </div>
    </div>
  </div>
`;

content += modalCode;

content = content.replace(/Lucas Antonio Burgos Loyola/g, "{{ user?.name }}");

fs.writeFileSync('frontend/src/app/components/dashboard-admin/dashboard-admin.component.html', content);
console.log('dashboard-admin done');
