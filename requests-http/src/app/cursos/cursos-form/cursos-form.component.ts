import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { CursosService } from '../cursos.service';
import { Cursos2Service } from '../cursos2.service';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss'],
})
export class CursosFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private service: Cursos2Service,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe(
    //   (params: any) => {
    //     const id = params['id']
    //     const curso$ = this.service.loadById(id)
    //     curso$.subscribe(curso => {
    //       this.updateForm(curso)
    //     })
    //   }
    // )

    // this.route.params.pipe(
    //   map((params: any) => params['id']),
    //   switchMap(id => this.service.loadById(id))
    // )
    //   .subscribe(curso => this.updateForm(curso))

    const curso = this.route.snapshot.data['curso'];

    this.form = this.fb.group({
      id: [curso.id],
      nome: [
        curso.nome,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
    });
  }

  // updateForm(curso) {
  //   this.form.patchValue({
  //     id: curso.id,
  //     nome: curso.nome,
  //   });
  // }

  hasError(field: string) {
    return this.form.get(field).errors;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      let msgSuccesso = 'Curso criado com sucesso.';
      let msgErro = 'Erro ao criar curso, tente novamente.';
      if (this.form.value.id) {
        msgSuccesso = 'Curso atualizado com sucesso.';
        msgErro = 'Erro ao atualizar curso, tente novamente.';
      }

      this.service.save(this.form.value).subscribe(
        (success) => {
          this.modal.showAlertSuccess(msgSuccesso);
          this.location.back();
        },
        (error) => this.modal.showAlertDanger(msgErro)
      );

      // if (this.form.value.id) {
      //   this.service.update(this.form.value).subscribe(
      //     (success) => {
      //       this.modal.showAlertSuccess('Curso atualizado com sucesso');
      //       this.location.back();
      //     },
      //     (error) =>
      //       this.modal.showAlertDanger(
      //         'Erro ao atualizar curso, tente novamente'
      //       ),
      //     () => console.log('update completo')
      //   );
      // } else {
      //   this.service.create(this.form.value).subscribe(
      //     (success) => {
      //       this.modal.showAlertSuccess('Curso criado com sucesso');
      //       this.location.back();
      //     },
      //     (error) =>
      //       this.modal.showAlertDanger('Erro ao criar curso, tente novamente'),
      //     () => console.log('request completo')
      //   );
      // }
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
  }
}
