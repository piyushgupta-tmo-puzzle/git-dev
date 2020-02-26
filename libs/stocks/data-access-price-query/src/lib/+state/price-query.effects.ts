import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map, switchMap } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';
import { differenceInMonths } from 'date-fns'

@Injectable()
export class PriceQueryEffects {
  public period: string;
  public currentDate = new Date();
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${
              this.calculatePeriod(action.startDate)
            }?token=${this.env.apiKey}`
          )
          .pipe(
            map((resp: PriceQueryResponse[]) =>
            resp.filter(priceQuery => {
                const respDate = new Date(priceQuery.date + ' 0:0:0');
                return (respDate >= action.startDate && respDate <= action.endDate)
              })), switchMap(resp => {
                return [
                  new PriceQueryFetched(resp as PriceQueryResponse[]),
                ];
              })
            )
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}

  public calculatePeriod(startDate): string {
    console.log(differenceInMonths(this.currentDate, startDate));
    if (differenceInMonths(this.currentDate, startDate) < 1) {
      this.period = '1m';
    }
    else if (differenceInMonths(this.currentDate, startDate) >= 1 && differenceInMonths(this.currentDate, startDate) < 3) {
      this.period = '3m';
    }
    else if (differenceInMonths(this.currentDate, startDate) >= 3 && differenceInMonths(this.currentDate, startDate) < 6) {
      this.period = '6m';
    }
    else if (differenceInMonths(this.currentDate, startDate) >= 6 && differenceInMonths(this.currentDate, startDate) < 12) {
      this.period = '1y';
    }
    else if (differenceInMonths(this.currentDate, startDate) >= 12 && differenceInMonths(this.currentDate, startDate) < 60) {
      this.period = '5y';
    }
    else if (differenceInMonths(this.currentDate, startDate) >= 60) {
      this.period = 'max';
    }
    return this.period;
  }
}
