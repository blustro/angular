import { Component, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Curso } from '../curso';
import { CursosService } from '../cursos.service';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cursos2Service } from '../cursos2.service';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  // cursos: Curso[]
  deleteModalRef: BsModalRef;
  @ViewChild('deleteModal', { static: true }) deleteModal;

  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  selectedCourse: Curso;

  // bsModalRef: BsModalRef;

  constructor(
    private service: Cursos2Service,
    private modalService: BsModalService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    /*this.service.list()
      .subscribe(data => this.cursos = data)*/
    this.onRefresh();
  }

  onRefresh() {
    this.cursos$ = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        // this.error$.next(true)
        this.handleError();
        return EMPTY;
      })
    );

    // this.service.list().
    //   pipe(
    //     catchError(error => EMPTY)
    //   )
    //   .subscribe(
    //     data => {
    //       console.log(data)
    //     }
    //     // error => console.error(error),
    //     // () => console.log('Observable completo!')
    //   )
  }

  handleError() {
    this.alertService.showAlertDanger(
      'Erro ao carregar cursos. Tente novamente mais tarde.'
    );
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde.';
  }

  onEdit(id) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso) {
    this.selectedCourse = curso;
    // this.deleteModalRef = this.modalService.show(this.deleteModal, {
    //   class: 'modal-sm',
    // });
    const result$ = this.alertService.showConfirm(
      'Confirmation',
      'Do you want to remove this course?'
    );
    result$
      .asObservable()
      .pipe(
        take(1),
        switchMap((result) => (result ? this.service.remove(curso.id) : EMPTY))
      )
      .subscribe(
        (success) => {
          this.onRefresh();
        },
        (error) => {
          this.alertService.showAlertDanger(
            "Course couldn't be removed. Try again later."
          );
        }
      );
  }

  onConfirmDelete() {
    this.service.remove(this.selectedCourse.id).subscribe(
      (success) => {
        this.onRefresh();
        this.deleteModalRef.hide();
      },
      (error) => {
        this.alertService.showAlertDanger(
          "Course couldn't be removed. Try again later."
        );
        this.deleteModalRef.hide();
      }
    );
  }

  onDeclineDelete() {
    this.deleteModalRef.hide();
  }
}
