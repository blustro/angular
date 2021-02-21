import { Injectable } from '@angular/core';
import { SharedModule } from './../shared.module';
import { HttpClient } from '@angular/common/http';

import { EstadoBr } from './../models/estado-br';
import { Cidade } from '../models/cidade';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: SharedModule,
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr() {
    return this.http.get<EstadoBr[]>('assets/data/estadosbr.json');
  }

  getCidades(idEstado: number) {
    return this.http.get<Cidade[]>('assets/data/cidades.json')
      .pipe(
        map((cidades: Cidade[]) => cidades.filter(c => c.estado == idEstado))
      )

  }

  getCargos() {
    return [
      { nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr' }
    ];
  }

  getTecnologias() {
    return [
      { nome: 'java', desc: 'Java' },
      { nome: 'js', desc: 'JavaScript' },
      { nome: 'php', desc: 'PHP' },
      { nome: 'ruby', desc: 'Ruby' },
    ];
  }

  getNewsletter() {
    return [
      { valor: 's', desc: 'Sim' },
      { valor: 'n', desc: 'Nao' },
    ]
  }
}
