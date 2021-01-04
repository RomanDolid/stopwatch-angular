import { Component, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { StopWatch } from "./stop-watch.interface";
import { TimeService } from "./timer.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnDestroy {
  @ViewChild('wait') wait: ElementRef;

  public stopwatch: StopWatch;
  private subscriptions: Subscription = new Subscription();

  constructor(private timerService: TimeService) {
    this.subscriptions.add(
      this.timerService.stopWatch$.subscribe(
        (val: StopWatch) => (this.stopwatch = val)
      )
    );
  }

  public startCount(): void {
    this.timerService.startCount();

  }

  public waitCount() {
    this.timerService.waitCount(this.wait);
  }

  public resetCount(): void {
    this.timerService.resetCount();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
