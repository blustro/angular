import { EstadoBr } from './../shared/models/estado-br';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DropdownService } from './../shared/services/dropdown.service';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { EMPTY, Observable, pipe } from 'rxjs';
import { FormValidations } from '../shared/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {
  // formulario: FormGroup
  estados: EstadoBr[]
  // estados: Observable<EstadoBr[]>
  cidades: Cidade[]
  cargos: any[]
  tecnologias: any[]
  newsletterOp: any[]

  frameworks = ['Angular', 'React', 'Vue', 'Sencha']

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super()
  }

  ngOnInit(): void {
    // this.verificaEmailService.verificarEmail('email@email.com').subscribe()

    // this.estados = this.dropdownService.getEstadosBr()
    this.dropdownService.getEstadosBr()
      .subscribe(data => this.estados = data)
    this.cargos = this.dropdownService.getCargos()
    this.tecnologias = this.dropdownService.getTecnologias()
    this.newsletterOp = this.dropdownService.getNewsletter()

    // this.dropdownService.getEstadosBr()
    //   .subscribe((res: EstadosBr) => { this.estados.push(res); });
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    // })

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologia: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });

    this.formulario.get('endereco.cep').statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
          : EMPTY
        )
      )
      .subscribe(data => data ? this.populaDadosForm(data) : {})

    this.formulario.get('endereco.estado').valueChanges
      .pipe(
        tap(estado => console.log('Novo estado:', estado)),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].id : EMPTY),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
      )
      .subscribe(cidades => this.cidades = cidades)

    // this.dropdownService.getCidades(26).subscribe(console.log)
  }


  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false))

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1))
  }

  submit() {
    console.log(this.formulario)

    let valueSubmit = Object.assign({}, this.formulario.value)

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => v ? this.frameworks[i] : null)
        .filter(v => v !== null)
    })

    console.log(valueSubmit);

    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
      .subscribe(data => {
        console.log(data);
        this.resetar();
      },
        (error: any) => alert('erro')
      );
  }

  consultaCEP() {
    const cep = this.formulario.get('endereco.cep')?.value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(data => this.populaDadosForm(data));
    }
  }

  populaDadosForm(data: any) {

    this.formulario.patchValue({
      endereco: {
        // cep: data.cep,
        rua: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      }
    });
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        cep: null,
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo').setValue(cargo);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologias() {
    this.formulario.get('tecnologia').setValue(['java', 'js', 'php']);
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null))
  }

}
