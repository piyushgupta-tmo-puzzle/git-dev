import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { MatDatepickerInputEvent } from '@angular/material';

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

  public fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const { symbol, startDate, endDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, startDate, endDate);
    }
  }
}
