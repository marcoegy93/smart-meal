import { HttpClient, HttpParams, HttpParamsOptions, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RestApiProvider {

  private static API_PATH = environment.apiUrl

  constructor(private http: HttpClient) {}

  post<T>(path: string, requestBody: any, queryParams?: { var: string, value: string }[], headers?: HttpHeaders): Promise<any> {
    const httpOptions = this.buildHttpOptions(queryParams, headers);
    return firstValueFrom(this.http.post<T>(RestApiProvider.API_PATH + "/" + path, requestBody, httpOptions));
  }

  get<T>(path: string, queryParams?: { var: string, value: string }[], headers?: HttpHeaders): Promise<any> {
    const httpOptions = this.buildHttpOptions(queryParams, headers);
    return firstValueFrom(this.http.get<T>(RestApiProvider.API_PATH + "/" + path, httpOptions));
  }

  patch<T>(path: string, requestBody: any, queryParams?: { var: string, value: string }[], headers?: HttpHeaders): Promise<any> {
    const httpOptions = this.buildHttpOptionsToText(queryParams, headers);
    return firstValueFrom(this.http.patch<T>(RestApiProvider.API_PATH + "/" + path, requestBody, httpOptions));
  }

  put<T>(path: string, requestBody: any, queryParams?: { var: string, value: string }[], headers?: HttpHeaders): Promise<any> {
    const httpOptions = this.buildHttpOptions(queryParams, headers);
    return firstValueFrom(this.http.put<T>(RestApiProvider.API_PATH + "/" + path, requestBody, httpOptions));
  }

  delete<T>(path: string, queryParams?: { var: string, value: string }[], headers?: HttpHeaders): Promise<any> {
    const httpOptions = this.buildHttpOptions(queryParams, headers);
    return firstValueFrom(this.http.delete<T>(RestApiProvider.API_PATH + "/" + path, httpOptions));
  }

  private buildHttpOptions(queryParams?: { var: string, value: string }[], headers?: HttpHeaders): any {
    let params = new HttpParams();
    if (queryParams && queryParams.length) {
      queryParams.forEach(param => {
        params = params.append(param.var, param.value);
      });
    }

    const defaultHeaders = {
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    };

    const mergedHeaders = headers ? headers : new HttpHeaders(defaultHeaders);

    return {
      params: params,
      headers: mergedHeaders
    };
  }

  private buildHttpOptionsToText(queryParams?: { var: string, value: string }[], headers?: HttpHeaders): any {
    let params = new HttpParams();
    if (queryParams && queryParams.length) {
      queryParams.forEach(param => {
        params = params.append(param.var, param.value);
      });
    }

    const defaultHeaders = {
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    };

    const mergedHeaders = headers ? headers : new HttpHeaders(defaultHeaders);

    return {
      params: params,
      responseType: "text",
      headers: mergedHeaders
    };
  }
}