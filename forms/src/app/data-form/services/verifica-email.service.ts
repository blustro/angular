import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string) {
    return this.http.get('assets/data/verificarEmail.json')
      .pipe(
        delay(2000),
        map((data: { emails: any[] }) => data.emails),
        map((data: { email: string }[]) => data.filter(v => v.email === email)),
        map((data: any[]) => data.length > 0)
      )
  }
}
