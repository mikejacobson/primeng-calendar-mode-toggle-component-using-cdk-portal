# primeng-calendar-mode-toggle-component-using-cdk-portal
### Angular Component that adds Selection Mode toggle to [PrimeNG Calendar component](https://www.primefaces.org/primeng/showcase/#/calendar) using CDK Portal

<br>
Working StackBlitz:

https://stackblitz.com/edit/primeng-calendar-with-selectionmode-toggle-using-cdk-portal?file=src%2Fapp%2Fcalendar-mode-toggle-buttons.component.ts

<br>

It just toggles between 'range' mode and 'single' mode but feel free to take the code and enhance it however you want. (The Calendar component also supports a 'multiple' mode but I didn't need to support that.)

<br>

Here's what the calendar looks like. I put the toggle buttons in the middle of the button bar because it seemed like a convenient and nice place for them.

#### Single-select Mode

![Calendar in Single-select Mode](/images/mode-date.png?raw=true)

#### Range-select Mode

![Calendar in Range-select Mode](/images/mode-date-range.png?raw=true)

<br>

And here's what the Component looks like sitting next to the `p-calendar` component. Note that it needs a reference to the `p-calendar` component passed into its `calendar` input.

```html
<div class="p-fluid p-grid p-formgrid">
  <div class="p-field p-col-12 p-md-4">
    <label>Single Selection or Range</label>
    <p-calendar
      #calendar     <-------------- component needs reference to Calendar component
      [(ngModel)]="rangeDates"
      selectionMode="single"
      [showButtonBar]="true"
      [readonlyInput]="true"
      inputId="range">
    </p-calendar>
    <calendar-mode-toggle-buttons [calendar]="calendar"></calendar-mode-toggle-buttons> <---- boom
  </div>
</div>
```

I also played around with adding the buttons via Directives instead:

This Directive adds the buttons programmatically using Renderer:

https://github.com/mikejacobson/primeng-calendar-mode-toggle-directive-using-renderer

With this Directive, you define the buttons in the template, which makes them a little easier to work with visually compared with the pure Renderer approach:

https://github.com/mikejacobson/primeng-calendar-mode-toggle-directive
