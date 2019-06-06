/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="google.visualization"/>
/// <reference types="google.visualization"/>
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { GoogleChartPackagesHelper } from '../helpers/google-chart-packages.helper';
export class RawChartComponent {
    /**
     * @param {?} element
     * @param {?} loaderService
     */
    constructor(element, loaderService) {
        this.element = element;
        this.loaderService = loaderService;
        this.dynamicResize = false;
        this.firstRowIsData = false;
        this.error = new EventEmitter();
        this.ready = new EventEmitter();
        this.select = new EventEmitter();
        this.mouseenter = new EventEmitter();
        this.mouseleave = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.chartData == null) {
            throw new Error('Can\'t create a Google Chart without data!');
        }
        this.loaderService.onReady.subscribe((/**
         * @return {?}
         */
        () => {
            this.createChart();
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.addResizeListener();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.wrapper) {
            this.updateChart();
        }
    }
    /**
     * @return {?}
     */
    getChartElement() {
        return this.element.nativeElement.firstElementChild;
    }
    /**
     * @return {?}
     */
    clearChart() {
        this.wrapper.getChart().clearChart();
    }
    /**
     * @protected
     * @return {?}
     */
    createChart() {
        this.loadNeededPackages().subscribe((/**
         * @return {?}
         */
        () => {
            this.wrapper = new google.visualization.ChartWrapper();
            this.updateChart();
        }));
    }
    /**
     * @protected
     * @return {?}
     */
    loadNeededPackages() {
        return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.chartData.chartType)]);
    }
    /**
     * @protected
     * @return {?}
     */
    updateChart() {
        // This check here is important to allow passing of a created dataTable as well as just an array
        if (!(this.chartData.dataTable instanceof google.visualization.DataTable)) {
            this.dataTable = google.visualization.arrayToDataTable((/** @type {?} */ (this.chartData.dataTable)), this.firstRowIsData);
        }
        else {
            this.dataTable = this.chartData.dataTable;
        }
        this.wrapper.setDataTable(this.dataTable);
        this.wrapper.setChartType(this.chartData.chartType);
        this.wrapper.setOptions(this.chartData.options);
        this.wrapper.setDataSourceUrl(this.chartData.dataSourceUrl);
        this.wrapper.setQuery(this.chartData.query);
        this.wrapper.setRefreshInterval(this.chartData.refreshInterval);
        this.wrapper.setView(this.chartData.view);
        this.removeChartEvents();
        this.registerChartEvents();
        if (this.formatter) {
            this.formatData(this.dataTable);
        }
        this.wrapper.draw(this.element.nativeElement);
    }
    /**
     * @protected
     * @param {?} dataTable
     * @return {?}
     */
    formatData(dataTable) {
        if (this.formatter instanceof Array) {
            this.formatter.forEach((/**
             * @param {?} value
             * @return {?}
             */
            value => {
                value.formatter.format(dataTable, value.colIndex);
            }));
        }
        else {
            for (let i = 0; i < dataTable.getNumberOfColumns(); i++) {
                this.formatter.format(dataTable, i);
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    addResizeListener() {
        if (this.dynamicResize) {
            fromEvent(window, 'resize')
                .pipe(debounceTime(100))
                .subscribe((/**
             * @return {?}
             */
            () => {
                this.ngOnChanges();
            }));
        }
    }
    /**
     * @private
     * @return {?}
     */
    removeChartEvents() {
        google.visualization.events.removeAllListeners(this.wrapper);
    }
    /**
     * @private
     * @return {?}
     */
    registerChartEvents() {
        this.registerChartEvent(this.wrapper, 'ready', (/**
         * @return {?}
         */
        () => {
            this.registerChartEvent(this.wrapper.getChart(), 'onmouseover', (/**
             * @param {?} event
             * @return {?}
             */
            event => this.mouseenter.emit(event)));
            this.registerChartEvent(this.wrapper.getChart(), 'onmouseout', (/**
             * @param {?} event
             * @return {?}
             */
            event => this.mouseleave.emit(event)));
            this.ready.emit('Chart Ready');
        }));
        this.registerChartEvent(this.wrapper, 'error', (/**
         * @param {?} error
         * @return {?}
         */
        error => this.error.emit(error)));
        this.registerChartEvent(this.wrapper, 'select', (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const selection = this.wrapper.getChart().getSelection();
            this.select.emit(selection);
        }));
    }
    /**
     * @private
     * @param {?} object
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    registerChartEvent(object, eventName, callback) {
        google.visualization.events.addListener(object, eventName, callback);
    }
}
RawChartComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'raw-chart',
                template: '',
                exportAs: 'raw-chart',
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [':host { width: fit-content; display: block; }']
            }] }
];
/** @nocollapse */
RawChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ScriptLoaderService }
];
RawChartComponent.propDecorators = {
    chartData: [{ type: Input }],
    formatter: [{ type: Input }],
    dynamicResize: [{ type: Input }],
    firstRowIsData: [{ type: Input }],
    error: [{ type: Output }],
    ready: [{ type: Output }],
    select: [{ type: Output }],
    mouseenter: [{ type: Output }],
    mouseleave: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    RawChartComponent.prototype.chartData;
    /** @type {?} */
    RawChartComponent.prototype.formatter;
    /** @type {?} */
    RawChartComponent.prototype.dynamicResize;
    /** @type {?} */
    RawChartComponent.prototype.firstRowIsData;
    /** @type {?} */
    RawChartComponent.prototype.error;
    /** @type {?} */
    RawChartComponent.prototype.ready;
    /** @type {?} */
    RawChartComponent.prototype.select;
    /** @type {?} */
    RawChartComponent.prototype.mouseenter;
    /** @type {?} */
    RawChartComponent.prototype.mouseleave;
    /** @type {?} */
    RawChartComponent.prototype.wrapper;
    /**
     * @type {?}
     * @private
     */
    RawChartComponent.prototype.dataTable;
    /**
     * @type {?}
     * @protected
     */
    RawChartComponent.prototype.element;
    /**
     * @type {?}
     * @protected
     */
    RawChartComponent.prototype.loaderService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9yYXctY2hhcnQvcmF3LWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkNBQTZDOztBQUU3QyxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBSVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHOUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFVcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7SUFxQzVCLFlBQXNCLE9BQW1CLEVBQVksYUFBa0M7UUFBakUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFZLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQXhCdkYsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFHdEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFHdkIsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRzVDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzNCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBR3hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzVDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO0lBTThDLENBQUM7Ozs7SUFFM0YsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFD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QyxVQUFVO1lBU0gsbUJBQW1COzs7d0JBWXpCLEtBQUs7d0JBR0wsS0FBSzs0QkFRTCxLQUFLOzZCQUdMLEtBQUs7b0JBR0wsTUFBTTtvQkFHTixNQUFNO3FCQUdOLE1BQU07eUJBR04sTUFBTTt5QkFHTixNQUFNOzs7O0lBN0JQLHNDQUMyQzs7SUFFM0Msc0NBTU87O0lBRVAsMENBQ3NCOztJQUV0QiwyQ0FDdUI7O0lBRXZCLGtDQUM0Qzs7SUFFNUMsa0NBQzJCOztJQUUzQixtQ0FDd0M7O0lBRXhDLHVDQUM0Qzs7SUFFNUMsdUNBQzRDOztJQUU1QyxvQ0FBMkM7Ozs7O0lBRTNDLHNDQUFrRDs7Ozs7SUFFdEMsb0NBQTZCOzs7OztJQUFFLDBDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLnZpc3VhbGl6YXRpb25cIi8+XHJcblxyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBBZnRlclZpZXdJbml0XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgeyBDaGFydEVycm9yRXZlbnQsIENoYXJ0RXZlbnQgfSBmcm9tICcuLi9tb2RlbHMvZXZlbnRzLm1vZGVsJztcclxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4uL3NjcmlwdC1sb2FkZXIvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRQYWNrYWdlc0hlbHBlciB9IGZyb20gJy4uL2hlbHBlcnMvZ29vZ2xlLWNoYXJ0LXBhY2thZ2VzLmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXHJcbiAgc2VsZWN0b3I6ICdyYXctY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxuICBzdHlsZXM6IFsnOmhvc3QgeyB3aWR0aDogZml0LWNvbnRlbnQ7IGRpc3BsYXk6IGJsb2NrOyB9J10sXHJcbiAgZXhwb3J0QXM6ICdyYXctY2hhcnQnLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSYXdDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKVxyXG4gIGNoYXJ0RGF0YTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRTcGVjcztcclxuXHJcbiAgQElucHV0KClcclxuICBmb3JtYXR0ZXI6XHJcbiAgICB8IGdvb2dsZS52aXN1YWxpemF0aW9uLkRlZmF1bHRGb3JtYXR0ZXJcclxuICAgIHwgQXJyYXk8e1xyXG4gICAgICAgIGZvcm1hdHRlcjogZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGVmYXVsdEZvcm1hdHRlcjtcclxuICAgICAgICBjb2xJbmRleDogbnVtYmVyO1xyXG4gICAgICB9PjtcclxuXHJcbiAgQElucHV0KClcclxuICBkeW5hbWljUmVzaXplID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZmlyc3RSb3dJc0RhdGEgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VlbnRlciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VsZWF2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFdmVudD4oKTtcclxuXHJcbiAgd3JhcHBlcjogZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyO1xyXG5cclxuICBwcml2YXRlIGRhdGFUYWJsZTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudDogRWxlbWVudFJlZiwgcHJvdGVjdGVkIGxvYWRlclNlcnZpY2U6IFNjcmlwdExvYWRlclNlcnZpY2UpIHt9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuY2hhcnREYXRhID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGNyZWF0ZSBhIEdvb2dsZSBDaGFydCB3aXRob3V0IGRhdGEhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLm9uUmVhZHkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5jcmVhdGVDaGFydCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmFkZFJlc2l6ZUxpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcygpIHtcclxuICAgIGlmICh0aGlzLndyYXBwZXIpIHtcclxuICAgICAgdGhpcy51cGRhdGVDaGFydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldENoYXJ0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJDaGFydCgpOiB2b2lkIHtcclxuICAgIHRoaXMud3JhcHBlci5nZXRDaGFydCgpLmNsZWFyQ2hhcnQoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBjcmVhdGVDaGFydCgpIHtcclxuICAgIHRoaXMubG9hZE5lZWRlZFBhY2thZ2VzKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcigpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBsb2FkTmVlZGVkUGFja2FnZXMoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sb2FkZXJTZXJ2aWNlLmxvYWRDaGFydFBhY2thZ2VzKFtHb29nbGVDaGFydFBhY2thZ2VzSGVscGVyLmdldFBhY2thZ2VGb3JDaGFydE5hbWUodGhpcy5jaGFydERhdGEuY2hhcnRUeXBlKV0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHVwZGF0ZUNoYXJ0KCkge1xyXG4gICAgLy8gVGhpcyBjaGVjayBoZXJlIGlzIGltcG9ydGFudCB0byBhbGxvdyBwYXNzaW5nIG9mIGEgY3JlYXRlZCBkYXRhVGFibGUgYXMgd2VsbCBhcyBqdXN0IGFuIGFycmF5XHJcbiAgICBpZiAoISh0aGlzLmNoYXJ0RGF0YS5kYXRhVGFibGUgaW5zdGFuY2VvZiBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUpKSB7XHJcbiAgICAgIHRoaXMuZGF0YVRhYmxlID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZSg8YW55W10+dGhpcy5jaGFydERhdGEuZGF0YVRhYmxlLCB0aGlzLmZpcnN0Um93SXNEYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0YVRhYmxlID0gdGhpcy5jaGFydERhdGEuZGF0YVRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMud3JhcHBlci5zZXREYXRhVGFibGUodGhpcy5kYXRhVGFibGUpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldENoYXJ0VHlwZSh0aGlzLmNoYXJ0RGF0YS5jaGFydFR5cGUpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldE9wdGlvbnModGhpcy5jaGFydERhdGEub3B0aW9ucyk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0RGF0YVNvdXJjZVVybCh0aGlzLmNoYXJ0RGF0YS5kYXRhU291cmNlVXJsKTtcclxuICAgIHRoaXMud3JhcHBlci5zZXRRdWVyeSh0aGlzLmNoYXJ0RGF0YS5xdWVyeSk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0UmVmcmVzaEludGVydmFsKHRoaXMuY2hhcnREYXRhLnJlZnJlc2hJbnRlcnZhbCk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0Vmlldyh0aGlzLmNoYXJ0RGF0YS52aWV3KTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUNoYXJ0RXZlbnRzKCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudHMoKTtcclxuXHJcbiAgICBpZiAodGhpcy5mb3JtYXR0ZXIpIHtcclxuICAgICAgdGhpcy5mb3JtYXREYXRhKHRoaXMuZGF0YVRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgZm9ybWF0RGF0YShkYXRhVGFibGU6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSkge1xyXG4gICAgaWYgKHRoaXMuZm9ybWF0dGVyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgdGhpcy5mb3JtYXR0ZXIuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgdmFsdWUuZm9ybWF0dGVyLmZvcm1hdChkYXRhVGFibGUsIHZhbHVlLmNvbEluZGV4KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFUYWJsZS5nZXROdW1iZXJPZkNvbHVtbnMoKTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXIuZm9ybWF0KGRhdGFUYWJsZSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkUmVzaXplTGlzdGVuZXIoKSB7XHJcbiAgICBpZiAodGhpcy5keW5hbWljUmVzaXplKSB7XHJcbiAgICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKVxyXG4gICAgICAgIC5waXBlKGRlYm91bmNlVGltZSgxMDApKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5uZ09uQ2hhbmdlcygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDaGFydEV2ZW50cygpIHtcclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnModGhpcy53cmFwcGVyKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50cygpIHtcclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3JlYWR5JywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIuZ2V0Q2hhcnQoKSwgJ29ubW91c2VvdmVyJywgZXZlbnQgPT4gdGhpcy5tb3VzZWVudGVyLmVtaXQoZXZlbnQpKTtcclxuICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLmdldENoYXJ0KCksICdvbm1vdXNlb3V0JywgZXZlbnQgPT4gdGhpcy5tb3VzZWxlYXZlLmVtaXQoZXZlbnQpKTtcclxuXHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdCgnQ2hhcnQgUmVhZHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ2Vycm9yJywgZXJyb3IgPT4gdGhpcy5lcnJvci5lbWl0KGVycm9yKSk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIsICdzZWxlY3QnLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMud3JhcHBlci5nZXRDaGFydCgpLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KHNlbGVjdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50KG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMuYWRkTGlzdGVuZXIob2JqZWN0LCBldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICB9XHJcbn1cclxuIl19