import { ApplicationRef, Component, ComponentFactoryResolver, Inject, Injector, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CdkPortal, DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Calendar } from 'primeng/calendar';

const primeNgButtonClasses = 'p-button-text p-ripple p-button p-component';
const primeNgSpanClasses = 'p-button p-button-text';

@Component({
  selector: 'calendar-mode-toggle-buttons',
  template: `
    <ng-template cdk-portal #buttons>
      <div class="toggle-wrapper">
        <button class="${primeNgButtonClasses}"
                [class.selected]="calendar.selectionMode==='single'"
                (click)="setMode('single', true)">Date</button>
        <span class="${primeNgSpanClasses}">|</span>
        <button class="${primeNgButtonClasses}"
                [class.selected]="calendar.selectionMode === 'range'"
                (click)="setMode('range', true)">Date Range</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .toggle-wrapper {
      display: flex;
      align-items: center;
    }

    .toggle-wrapper button {
      letter-spacing: 0.235px;
      padding: 8px;
    }
    .toggle-wrapper button.selected {
      font-weight: 700;
      letter-spacing: 0;
    }

    .toggle-wrapper span {
      font-size: 1.25em;
      opacity: 0.7;
      padding: 0;
    }
  `]
})
export class CalendarModeToggleButtonsComponent implements AfterViewInit, OnDestroy {
  @Input('calendar') calendar: Calendar;
  @ViewChild(CdkPortal) portal: TemplatePortal;

  portalOutlet: DomPortalOutlet;
  destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  ngAfterViewInit() {
    this.calendar.onShow.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.onCalendarShown())

    this.calendar.onTodayClick.subscribe(() => {
      this.handleTodayClick();
    });
  }

  ngOnDestroy() {
    this.portalOutlet.detach();
  }

  onCalendarShown() {
    setTimeout(() => {
      this.portalOutlet = new DomPortalOutlet(
        this.document.querySelector('.p-datepicker-buttonbar'),
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      );

      this.portalOutlet.attach(this.portal);

      const buttonbar = this.document.querySelector('.p-datepicker-buttonbar');
      const clearButton = this.document.querySelector('.p-datepicker-buttonbar > button:last-of-type');
      const toggleWrapper: HTMLDivElement = this.document.querySelector('.toggle-wrapper');
      buttonbar.insertBefore(toggleWrapper, clearButton);
    }, 10)
  }

  handleTodayClick() {
    if (this.calendar.selectionMode === 'single') {
      return;
    }

    this.calendar.value = this.calendar.value[0];

    setTimeout(() => {
      this.setMode('single');
      this.calendar.writeValue(this.calendar.value);
      this.calendar.hideOverlay();
    });
  }

  setMode(newMode: string, clearSelection = false) {
    this.calendar.selectionMode = newMode;

    if (clearSelection) {
      this.clearDateSelection();
    }
  }

  clearDateSelection() {
    const selectedMonth = this.calendar.currentMonth;
    const selectedYear = this.calendar.currentYear;

    this.calendar.writeValue(null);

    let didRestoreSelection = false;

    if (this.calendar.currentMonth !== selectedMonth) {
      this.calendar.currentMonth = selectedMonth;
      didRestoreSelection = true;
    }

    if (this.calendar.currentYear !== selectedYear) {
      this.calendar.currentYear = selectedYear;
      didRestoreSelection = true;
    }

    if (didRestoreSelection) {
      // prevent jump to current month when clearing selection
      this.calendar.createMonths(this.calendar.currentMonth, this.calendar.currentYear);
    }
  }
}
