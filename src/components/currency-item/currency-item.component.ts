import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";

import { CurrencyInterface } from "./currency-interface";

@Component({
    selector: "app-currency-item",
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: "./currency-item.component.html",
    styleUrl: "./currency-item.component.css"
})
export class CurrencyItemComponent {
    private currency: CurrencyInterface | undefined;
    private subscription: Subscription | undefined;

    @Input() currencyName: string | undefined;
    @Input() currencyPrice: number | undefined;
    @Input() currencyDiff: number | undefined;

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
