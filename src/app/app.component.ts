import { Component, DoCheck } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface CurrencyRate {
  rates: { [key: string]: number };
  base: string; 
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  currency1Amount = 0;
  currency2Amount = 0;
  currency1 = 'USD';
  currency2 = 'EUR';
  exchangeRate = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getExchangeRate();
  }

  getExchangeRate() {
    const url = `https://api.exchangerate-api.com/v4/latest/${this.currency1}`;
    this.http.get<CurrencyRate>(url).subscribe(data => {
      this.exchangeRate = data.rates[this.currency2];
      if (this.currency2 === 'UAH') {
        this.exchangeRate = 1 / this.exchangeRate; 
      }
      });
  }


onCurrencyChange() {
  this.getExchangeRate();
  this.convertCurrency();
}


  convertCurrency() {
  if (this.currency1Amount && this.exchangeRate) {
    this.currency2Amount = this.currency1Amount * this.exchangeRate;
  } else if (this.currency2Amount && this.exchangeRate) {
    this.currency1Amount = this.currency2Amount / this.exchangeRate;
  }
    if (this.currency1Amount && this.exchangeRate) {
      if (this.currency2 === 'UAH') {
        this.currency2Amount = this.currency1Amount / this.exchangeRate;
      } else {
        this.currency2Amount = this.currency1Amount * this.exchangeRate;
      }
    } else if (this.currency2Amount && this.exchangeRate) {
      if (this.currency1 === 'UAH') {
        this.currency1Amount = this.currency2Amount / this.exchangeRate;
      } else {
        this.currency1Amount = this.currency2Amount * this.exchangeRate;
      }
    }    
  }

  ngDoCheck() {
    this.convertCurrency();
  }
}
