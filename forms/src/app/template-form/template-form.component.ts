import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  onSubmit(formulario: any) {
    console.log(formulario)

    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value))
      .subscribe(data => {
        console.log(data)
        formulario.form.reset()
      })
  }
  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {
  }

  verificaCampoValidTouched(campo: any) {
    return !campo.valid && campo.touched
  }

  aplicaCSSErro(campo: any) {
    return { 'is-invalid': this.verificaCampoValidTouched(campo) }
  }

  consultaCEP(event: any, form: Object) {
    let cep = event.target.value;

    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(data => this.populaDadosForm(data, form));
    }
  }

  populaDadosForm(data: any, formulario: any) {
    // formulario.setValue({
    //   nome: formulario.value.nome,
    //   email: formulario.value.email,
    //   endereco: {
    //     cep: data.cep,
    //     rua: data.logradouro,
    //     numero: '',
    //     complemento: data.complemento,
    //     bairro: data.bairro,
    //     cidade: data.localidade,
    //     estado: data.uf
    //   }
    // })

    formulario.form.patchValue({
      endereco: {
        cep: data.cep,
        rua: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      }
    })
  }

  resetaDadosForm(formulario: any) {
    formulario.form.patchValue({
      endereco: {
        cep: null,
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }
}
