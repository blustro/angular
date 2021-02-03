import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-binding',
  templateUrl: './data-binding.component.html',
  styleUrls: ['./data-binding.component.css']
})
export class DataBindingComponent implements OnInit {

  url: string = 'http://loiane.com';
  cursoAngular: boolean = true;
  urlImage = 'http://lorempixel.com/400/200/sports/'

  valorAtual:string = ''
  valorSalvo = ''

  isMouseOver: boolean = false;

  courseName: string = 'Angular'

  valorInicial = 15

  getValor() {
    return 1;
  }

  getCurtirCurso() {
    return true;
  }

  clickedButton() {
    alert('Clicked Button')
  }

  onKeyUp(event: KeyboardEvent) {
    this.valorAtual = (<HTMLInputElement>event.target).value
  }

  salvarValor(valor) {
    this.valorSalvo = valor;
  }

  onMouseOverOut() {
    this.isMouseOver = !this.isMouseOver
  }

  onMudouValor(evento) {
    console.log(evento.novoValor)
  }
  constructor() { }

  ngOnInit(): void {
  }

}
