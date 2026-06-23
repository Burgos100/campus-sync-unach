const fs = require('fs');

let content = fs.readFileSync('admin_usuarios_main.html', 'utf-8');

// The main loop for users
const rowStart = `<tr class="hover:bg-primary/5 transition-colors group">`;
const tbodyRegex = /<tbody class="divide-y divide-outline-variant\/30">([\s\S]*?)<\/tbody>/;
const match = content.match(tbodyRegex);

if (match) {
    const newTbody = `
<tbody class="divide-y divide-outline-variant/30">
  <tr *ngIf="usuarios.length === 0">
    <td colspan="5" class="p-8 text-center text-gray-500">No hay usuarios registrados.</td>
  </tr>
  <tr *ngFor="let user of usuarios" class="hover:bg-primary/5 transition-colors group">
    <td class="px-6 py-5">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden">
          <span class="material-symbols-outlined text-gray-400">person</span>
        </div>
        <div>
          <p class="font-bold text-on-surface text-body-md font-body-md">{{ user.name }}</p>
          <p class="text-label-sm font-label-sm text-secondary">ID: {{ user.id || 'N/A' }}</p>
        </div>
      </div>
    </td>
    <td class="px-6 py-5 text-body-md font-body-md text-secondary">{{ user.email }}</td>
    <td class="px-6 py-5">
      <span class="px-3 py-1 rounded-full text-label-sm font-label-sm border"
            [ngClass]="{'bg-secondary-container/50 text-on-secondary-fixed-variant border-secondary-fixed-dim': user.role === 'Admin', 'bg-primary-fixed/30 text-primary border-primary-fixed': user.role !== 'Admin'}">
        {{ user.role }}
      </span>
    </td>
    <td class="px-6 py-5">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-tertiary"></span>
        <span class="text-label-sm font-label-sm text-tertiary">Activo</span>
      </div>
    </td>
    <td class="px-6 py-5 text-right">
      <button class="p-2 hover:bg-surface-variant rounded-lg transition-all text-secondary">
        <span class="material-symbols-outlined" data-icon="edit">edit</span>
      </button>
      <button class="p-2 hover:bg-error-container/20 rounded-lg transition-all text-error">
        <span class="material-symbols-outlined" data-icon="delete">delete</span>
      </button>
    </td>
  </tr>
</tbody>
`;
    content = content.replace(tbodyRegex, newTbody);
}

// Add loading/error states at the top
const headerCardRegex = /(<div class="max-w-container-max mx-auto px-6 py-10 md:px-10 lg:px-12">)/;
const injectedStates = `
$1
  <div *ngIf="loading" class="text-center py-12">
    <p class="text-gray-500">Cargando usuarios...</p>
  </div>
  <div *ngIf="!loading && error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
    {{ error }}
  </div>
  <div *ngIf="!loading && !error">
`;
content = content.replace(headerCardRegex, injectedStates);

// Close the if block at the end
content = content + '\n  </div>';

// Write
fs.writeFileSync('frontend/src/app/components/admin-usuarios/admin-usuarios.component.html', content);
console.log('admin-usuarios done');
