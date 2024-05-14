import { Component, OnDestroy, OnInit } from "@angular/core";
import { concatMap, interval, Subscription } from "rxjs";

import { HttpService } from "../../app/http.service";
import { CurrencyInterface } from "../currency-item/currency-interface";
import { CurrencyItemComponent } from "../currency-item/currency-item.component";

@Component({
    selector: "app-board",
    standalone: true,
    imports: [CurrencyItemComponent],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.css",
})
export class BoardComponent implements OnInit, OnDestroy {
    private subscription: Subscription | undefined;
    protected currencyData: CurrencyInterface | undefined;
    protected currencyItemList: [string, number | undefined, number | undefined][] = [];
    protected currToFetch: string = "USD%2CEUR%2CGBP";
    protected hideDropdown: boolean = true;
    protected timestamp: string | undefined;
    private refreshInterval = 5000; // 5 секунд

    constructor(private httpService: HttpService) { }

    protected fetchData(fetchData: string) {
        this.subscription = this.httpService.getData(fetchData).subscribe({
            next: (response: any) => {
                this.handleCurrencyData(response);
            }
        });
    }

    private handleCurrencyData(response: CurrencyInterface) {
        this.currencyData = response;
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "numeric",
            year: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        };

        this.timestamp = date.toLocaleString("en-US", options);

        if (this.currencyData && this.currencyData.quotes) {
            this.currencyItemList = this.processCurrencyQuotes(this.currencyData.quotes);
        }
    }

    private processCurrencyQuotes(quotes: Record<string, string> | undefined):
    [string, number | undefined, number | undefined][] {
        if (!quotes) {
            throw new Error("Quotes data is undefined");
        }

        const currencyList: [string, number | undefined, number | undefined][] = [];

        for (const [key, value] of Object.entries(quotes)) {
            const currencyCode = key.slice(3);
            const prevRate = localStorage.getItem(currencyCode);
            let prevVal: number | undefined;
            if (prevRate) {
                prevVal = this.processPrice(prevRate);
            }
            if (!prevRate) {
                localStorage.setItem(currencyCode, value);
            }
            const currValue = this.processPrice(value);
            const diff = currValue !== undefined && prevVal !== undefined
                ? +(currValue - prevVal).toFixed(2)
                : undefined;
            localStorage.setItem(currencyCode, value);
            currencyList.push([currencyCode, currValue, diff]);
        }

        return currencyList;
    }

    private processPrice(price: string): number {
        return +(1 / Number(price)).toFixed(2);
    }
    async addCurrency(currencyCode: string): Promise<void> {
        if (!this.currToFetch.includes(currencyCode)) {
            this.currToFetch += `,${currencyCode}`;
            this.fetchData(this.currToFetch);
        } else {
            alert("This currency is already in use.");
        }
    }

    toggleDropdown() {
        this.hideDropdown = !this.hideDropdown;
    }

    ngOnInit() {
        this.fetchData(this.currToFetch);
        this.subscription = interval(this.refreshInterval)
            .pipe(
                concatMap(() => this.httpService.getData(this.currToFetch))
            )
            .subscribe((response) => {
                this.handleCurrencyData(response as CurrencyInterface);
            });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
