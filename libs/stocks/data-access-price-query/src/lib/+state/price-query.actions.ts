import { Action } from '@ngrx/store';
import { PriceQueryResponse } from './price-query.type';

export enum PriceQueryActionTypes {
  SelectSymbol = 'priceQuery.selectSymbol',
  FetchPriceQuery = 'priceQuery.fetch',
  PriceQueryFetched = 'priceQuery.fetched',
  PriceQueryFetchError = 'priceQuery.error'
}

export class FetchPriceQuery implements Action {
  readonly type = PriceQueryActionTypes.FetchPriceQuery;
  constructor(public symbol: string, public startDate: Date, public endDate: Date) {}
}

export class PriceQueryFetchError implements Action {
  readonly type = PriceQueryActionTypes.PriceQueryFetchError;
  constructor(public error: any) {}
}

export class PriceQueryFetched implements Action {
  readonly type = PriceQueryActionTypes.PriceQueryFetched;
  constructor(public queryResults: PriceQueryResponse[]) {}
}

export class SelectSymbol implements Action {
  readonly type = PriceQueryActionTypes.SelectSymbol;
  constructor(public symbol: string) {}
}

export type PriceQueryAction =
  | FetchPriceQuery
  | PriceQueryFetched
  | PriceQueryFetchError
  | SelectSymbol;

export const fromPriceQueryActions = {
  FetchPriceQuery,
  PriceQueryFetched,
  PriceQueryFetchError,
  SelectSymbol
};
