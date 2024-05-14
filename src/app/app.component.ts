import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { BoardComponent } from "../components/board/board.component";
import { CurrencyItemComponent } from "../components/currency-item/currency-item.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, CurrencyItemComponent, BoardComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css"
})
export class AppComponent {
    title = "AngularTest";
}
