import { Injectable, ElementRef } from "@angular/core";
import { Observable, timer, BehaviorSubject, Subscription, fromEvent, Subject } from "rxjs";
import { map, buffer, debounceTime, filter } from "rxjs/operators";

import { StopWatch } from "./stop-watch.interface";

@Injectable({
  providedIn: "root"
})
export class TimeService {
  private readonly initialTime = 0;
  private timer$: BehaviorSubject<number> = new BehaviorSubject(this.initialTime);
  private lastStopedTime: number = this.initialTime;
  private timerSubscription: Subscription = new Subscription();
  private isRunning: boolean = false;


  public get stopWatch$(): Observable<StopWatch> {
    return this.timer$.pipe(
      map((seconds: number): StopWatch => this.secondsToStopWatch(seconds))
    );
  }

  startCount(): void {
    if (this.isRunning) {
      this.resetCount();
      return;
    }
    this.timerSubscription = timer(0, 1000)
      .pipe(map((value: number): number => value + this.lastStopedTime))
      .subscribe(this.timer$);
    this.isRunning = true;

  }


  waitCount(el: ElementRef): void {
     if (this.isRunning) {
      const clicks$ = fromEvent(el.nativeElement, 'click');

      clicks$
        .pipe(
          buffer(clicks$.pipe(debounceTime(300))),
          map((list) => {
            return list.length;
          }),
          filter((x) => x === 2)
        )
        .subscribe(() => {
          this.lastStopedTime = this.initialTime;
          this.timerSubscription.unsubscribe();
          this.isRunning = false;
        });
    }
  }

  resetCount(): void {
    this.timerSubscription.unsubscribe();
    this.lastStopedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    this.isRunning = false;
  }

  private secondsToStopWatch(seconds: number): StopWatch {
    let rest = seconds;
    const hours = Math.floor(seconds / 3600);
    rest = seconds % 3600;
    const minutes = Math.floor(rest / 60);
    rest = seconds % 60;

    return {
      hours: this.convertToNumberString(hours),
      minutes: this.convertToNumberString(minutes),
      seconds: this.convertToNumberString(seconds)
    };
  }

  private convertToNumberString(value: number): string {
    return `${value < 10 ? "0" + value : value}`;
  }

}
