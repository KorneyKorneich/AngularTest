import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class HttpService {
    private url = "https://api.apilayer.com/currency_data/live?source=RUB&currencies=";
    constructor(private http: HttpClient) {}

    getData(fetchData: string) {
        const headers = new HttpHeaders()
            .set("content-type", "application/json")
            .set("apikey", "m9uCoSOg40M1b2PRgwqHRm3B1eqYdSDb");
        return this.http.get(this.url.concat("", fetchData), { headers });
    }
}
