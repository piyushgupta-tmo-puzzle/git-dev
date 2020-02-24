import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { MatDatepickerInputEvent } from '@angular/material';
import { format, differenceInMonths, subDays } from 'date-fns'

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  public stockPickerForm: FormGroup;
  public symbol: string;
  public startDate: Date;
  public endDate: Date;
  public currentDate = new Date();
  public dateDiff: Date;
  events: string[] = [];  
  public period: string;

  quotes$ = this.priceQuery.priceQueries$;

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date())
    });
  }

  ngOnInit() {}

  public dateValidator = (type: string, event: MatDatepickerInputEvent<Date>): void => {
    if (type === 'startChanged') {
      if (new Date(event.value) > this.stockPickerForm.value.endDate) {
        this.stockPickerForm.controls.startDate.setValue(
          this.stockPickerForm.value.endDate
        );
      }
    } else if (type === 'endChanged') {
      if (new Date(event.value) < this.stockPickerForm.value.startDate) {
        this.stockPickerForm.controls.endDate.setValue(
          this.stockPickerForm.value.startDate
        );
      }
    }
  };

  public calculatePeriod(startDate): string {
    if (differenceInMonths(this.currentDate, startDate) < 1) {
      this.period = '1m';
    }
    else if (differenceInMonths(this.currentDate, startDate) >= 1 && differenceInMonths(this.currentDate, startDate) <= 3) {
      this.period = '3m';
    }
    else if (differenceInMonths(this.currentDate, startDate) > 3 && differenceInMonths(this.currentDate, startDate) <= 6) {
      this.period = '6m';
    }
    else if (differenceInMonths(this.currentDate, startDate) > 6 && differenceInMonths(this.currentDate, startDate) <= 12) {
      this.period = '1y';
    }
    else if (differenceInMonths(this.currentDate, startDate) > 12 && differenceInMonths(this.currentDate, startDate) <= 60) {
      this.period = '5y';
    }
    else if (differenceInMonths(this.currentDate, startDate) > 60) {
      this.period = 'max';
    }
    return this.period;
  }

  public fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const { symbol, startDate, endDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, this.calculatePeriod(startDate), startDate, endDate);
    }
  }
}
