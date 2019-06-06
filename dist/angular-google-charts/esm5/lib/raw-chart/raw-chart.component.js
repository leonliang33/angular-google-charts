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
var RawChartComponent = /** @class */ (function () {
    function RawChartComponent(element, loaderService) {
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
    RawChartComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.chartData == null) {
            throw new Error('Can\'t create a Google Chart without data!');
        }
        this.loaderService.onReady.subscribe((/**
         * @return {?}
         */
        function () {
            _this.createChart();
        }));
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.addResizeListener();
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (this.wrapper) {
            this.updateChart();
        }
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.getChartElement = /**
     * @return {?}
     */
    function () {
        return this.element.nativeElement.firstElementChild;
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.clearChart = /**
     * @return {?}
     */
    function () {
        this.wrapper && this.wrapper.getChart() && this.wrapper.getChart().clearChart();
    };
    /**
     * @protected
     * @return {?}
     */
    RawChartComponent.prototype.createChart = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        this.loadNeededPackages().subscribe((/**
         * @return {?}
         */
        function () {
            _this.wrapper = new google.visualization.ChartWrapper();
            _this.updateChart();
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    RawChartComponent.prototype.loadNeededPackages = /**
     * @protected
     * @return {?}
     */
    function () {
        return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.chartData.chartType)]);
    };
    /**
     * @protected
     * @return {?}
     */
    RawChartComponent.prototype.updateChart = /**
     * @protected
     * @return {?}
     */
    function () {
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
    };
    /**
     * @protected
     * @param {?} dataTable
     * @return {?}
     */
    RawChartComponent.prototype.formatData = /**
     * @protected
     * @param {?} dataTable
     * @return {?}
     */
    function (dataTable) {
        if (this.formatter instanceof Array) {
            this.formatter.forEach((/**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                value.formatter.format(dataTable, value.colIndex);
            }));
        }
        else {
            for (var i = 0; i < dataTable.getNumberOfColumns(); i++) {
                this.formatter.format(dataTable, i);
            }
        }
    };
    /**
     * @private
     * @return {?}
     */
    RawChartComponent.prototype.addResizeListener = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.dynamicResize) {
            fromEvent(window, 'resize')
                .pipe(debounceTime(100))
                .subscribe((/**
             * @return {?}
             */
            function () {
                _this.ngOnChanges();
            }));
        }
    };
    /**
     * @private
     * @return {?}
     */
    RawChartComponent.prototype.removeChartEvents = /**
     * @private
     * @return {?}
     */
    function () {
        google.visualization.events.removeAllListeners(this.wrapper);
    };
    /**
     * @private
     * @return {?}
     */
    RawChartComponent.prototype.registerChartEvents = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.registerChartEvent(this.wrapper, 'ready', (/**
         * @return {?}
         */
        function () {
            _this.registerChartEvent(_this.wrapper.getChart(), 'onmouseover', (/**
             * @param {?} event
             * @return {?}
             */
            function (event) { return _this.mouseenter.emit(event); }));
            _this.registerChartEvent(_this.wrapper.getChart(), 'onmouseout', (/**
             * @param {?} event
             * @return {?}
             */
            function (event) { return _this.mouseleave.emit(event); }));
            _this.ready.emit('Chart Ready');
        }));
        this.registerChartEvent(this.wrapper, 'error', (/**
         * @param {?} error
         * @return {?}
         */
        function (error) { return _this.error.emit(error); }));
        this.registerChartEvent(this.wrapper, 'select', (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var selection = _this.wrapper.getChart().getSelection();
            _this.select.emit(selection);
        }));
    };
    /**
     * @private
     * @param {?} object
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    RawChartComponent.prototype.registerChartEvent = /**
     * @private
     * @param {?} object
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    function (object, eventName, callback) {
        google.visualization.events.addListener(object, eventName, callback);
    };
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
    RawChartComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ScriptLoaderService }
    ]; };
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
    return RawChartComponent;
}());
export { RawChartComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9yYXctY2hhcnQvcmF3LWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkNBQTZDOztBQUU3QyxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBSVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHOUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFFcEY7SUE2Q0UsMkJBQXNCLE9BQW1CLEVBQVksYUFBa0M7UUFBakUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFZLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQXhCdkYsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFHdEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFHdkIsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRzVDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzNCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBR3hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzVDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO0lBTThDLENBQUM7Ozs7SUFFM0Ysb0NBQVE7OztJQUFSO1FBQUEsaUJBUUM7UUFQQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUMvRDtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVM7OztRQUFDO1lBQ25DLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCwyQ0FBZTs7O0lBQWY7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7O0lBRUQsdUNBQVc7OztJQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Ozs7SUFFTSwyQ0FBZTs7O0lBQXRCO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztJQUN0RCxDQUFDOzs7O0lBRU0sc0NBQVU7OztJQUFqQjtRQUNFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2xGLENBQUM7Ozs7O0lBRVMsdUNBQVc7Ozs7SUFBckI7UUFBQSxpQkFLQztRQUpDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFNBQVM7OztRQUFDO1lBQ2xDLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZELEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRVMsOENBQWtCOzs7O0lBQTVCO1FBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMseUJBQXlCLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUgsQ0FBQzs7Ozs7SUFFUyx1Q0FBVzs7OztJQUFyQjtRQUNFLGdHQUFnRztRQUNoRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsWUFBWSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBQSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM5RzthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztTQUMzQztRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFM0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs7Ozs7SUFFUyxzQ0FBVTs7Ozs7SUFBcEIsVUFBcUIsU0FBeUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsU0FBUyxZQUFZLEtBQUssRUFBRTtZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Ozs7WUFBQyxVQUFBLEtBQUs7Z0JBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxFQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDckM7U0FDRjtJQUNILENBQUM7Ozs7O0lBRU8sNkNBQWlCOzs7O0lBQXpCO1FBQUEsaUJBUUM7UUFQQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7aUJBQ3hCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3ZCLFNBQVM7OztZQUFDO2dCQUNULEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixDQUFDLEVBQUMsQ0FBQztTQUNOO0lBQ0gsQ0FBQzs7Ozs7SUFFTyw2Q0FBaUI7Ozs7SUFBekI7UUFDRSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7Ozs7SUFFTywrQ0FBbUI7Ozs7SUFBM0I7UUFBQSxpQkFhQztRQVpDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU87OztRQUFFO1lBQzdDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLGFBQWE7Ozs7WUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixFQUFDLENBQUM7WUFDdEcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsWUFBWTs7OztZQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQTNCLENBQTJCLEVBQUMsQ0FBQztZQUVyRyxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqQyxDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU87Ozs7UUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUF0QixDQUFzQixFQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUTs7O1FBQUU7O2dCQUN4QyxTQUFTLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUU7WUFDeEQsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7OztJQUVPLDhDQUFrQjs7Ozs7OztJQUExQixVQUEyQixNQUFXLEVBQUUsU0FBaUIsRUFBRSxRQUFrQjtRQUMzRSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDOztnQkEzSkYsU0FBUyxTQUFDOztvQkFFVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLEVBQUU7b0JBRVosUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzZCQUZ0QywrQ0FBK0M7aUJBR3pEOzs7O2dCQW5CQyxVQUFVO2dCQVNILG1CQUFtQjs7OzRCQVl6QixLQUFLOzRCQUdMLEtBQUs7Z0NBUUwsS0FBSztpQ0FHTCxLQUFLO3dCQUdMLE1BQU07d0JBR04sTUFBTTt5QkFHTixNQUFNOzZCQUdOLE1BQU07NkJBR04sTUFBTTs7SUFzSFQsd0JBQUM7Q0FBQSxBQTVKRCxJQTRKQztTQXBKWSxpQkFBaUI7OztJQUM1QixzQ0FDMkM7O0lBRTNDLHNDQU1POztJQUVQLDBDQUNzQjs7SUFFdEIsMkNBQ3VCOztJQUV2QixrQ0FDNEM7O0lBRTVDLGtDQUMyQjs7SUFFM0IsbUNBQ3dDOztJQUV4Qyx1Q0FDNEM7O0lBRTVDLHVDQUM0Qzs7SUFFNUMsb0NBQTJDOzs7OztJQUUzQyxzQ0FBa0Q7Ozs7O0lBRXRDLG9DQUE2Qjs7Ozs7SUFBRSwwQ0FBNEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS52aXN1YWxpemF0aW9uXCIvPlxyXG5cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBFbGVtZW50UmVmLFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgQWZ0ZXJWaWV3SW5pdFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHsgQ2hhcnRFcnJvckV2ZW50LCBDaGFydEV2ZW50IH0gZnJvbSAnLi4vbW9kZWxzL2V2ZW50cy5tb2RlbCc7XHJcbmltcG9ydCB7IFNjcmlwdExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi9zY3JpcHQtbG9hZGVyL3NjcmlwdC1sb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEdvb2dsZUNoYXJ0UGFja2FnZXNIZWxwZXIgfSBmcm9tICcuLi9oZWxwZXJzL2dvb2dsZS1jaGFydC1wYWNrYWdlcy5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxyXG4gIHNlbGVjdG9yOiAncmF3LWNoYXJ0JyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbiAgc3R5bGVzOiBbJzpob3N0IHsgd2lkdGg6IGZpdC1jb250ZW50OyBkaXNwbGF5OiBibG9jazsgfSddLFxyXG4gIGV4cG9ydEFzOiAncmF3LWNoYXJ0JyxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUmF3Q2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KClcclxuICBjaGFydERhdGE6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0U3BlY3M7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZm9ybWF0dGVyOlxyXG4gICAgfCBnb29nbGUudmlzdWFsaXphdGlvbi5EZWZhdWx0Rm9ybWF0dGVyXHJcbiAgICB8IEFycmF5PHtcclxuICAgICAgICBmb3JtYXR0ZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRlZmF1bHRGb3JtYXR0ZXI7XHJcbiAgICAgICAgY29sSW5kZXg6IG51bWJlcjtcclxuICAgICAgfT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZHluYW1pY1Jlc2l6ZSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGZpcnN0Um93SXNEYXRhID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIG1vdXNlZW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIG1vdXNlbGVhdmUgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXZlbnQ+KCk7XHJcblxyXG4gIHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcjtcclxuXHJcbiAgcHJpdmF0ZSBkYXRhVGFibGU6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCBsb2FkZXJTZXJ2aWNlOiBTY3JpcHRMb2FkZXJTZXJ2aWNlKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLmNoYXJ0RGF0YSA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBjcmVhdGUgYSBHb29nbGUgQ2hhcnQgd2l0aG91dCBkYXRhIScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5vblJlYWR5LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5hZGRSZXNpemVMaXN0ZW5lcigpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoKSB7XHJcbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRDaGFydEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQ2hhcnQoKTogdm9pZCB7XHJcbiAgICB0aGlzLndyYXBwZXIgJiYgdGhpcy53cmFwcGVyLmdldENoYXJ0KCkgJiYgdGhpcy53cmFwcGVyLmdldENoYXJ0KCkuY2xlYXJDaGFydCgpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGNyZWF0ZUNoYXJ0KCkge1xyXG4gICAgdGhpcy5sb2FkTmVlZGVkUGFja2FnZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLndyYXBwZXIgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKCk7XHJcbiAgICAgIHRoaXMudXBkYXRlQ2hhcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGxvYWROZWVkZWRQYWNrYWdlcygpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLmxvYWRlclNlcnZpY2UubG9hZENoYXJ0UGFja2FnZXMoW0dvb2dsZUNoYXJ0UGFja2FnZXNIZWxwZXIuZ2V0UGFja2FnZUZvckNoYXJ0TmFtZSh0aGlzLmNoYXJ0RGF0YS5jaGFydFR5cGUpXSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgdXBkYXRlQ2hhcnQoKSB7XHJcbiAgICAvLyBUaGlzIGNoZWNrIGhlcmUgaXMgaW1wb3J0YW50IHRvIGFsbG93IHBhc3Npbmcgb2YgYSBjcmVhdGVkIGRhdGFUYWJsZSBhcyB3ZWxsIGFzIGp1c3QgYW4gYXJyYXlcclxuICAgIGlmICghKHRoaXMuY2hhcnREYXRhLmRhdGFUYWJsZSBpbnN0YW5jZW9mIGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSkpIHtcclxuICAgICAgdGhpcy5kYXRhVGFibGUgPSBnb29nbGUudmlzdWFsaXphdGlvbi5hcnJheVRvRGF0YVRhYmxlKDxhbnlbXT50aGlzLmNoYXJ0RGF0YS5kYXRhVGFibGUsIHRoaXMuZmlyc3RSb3dJc0RhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kYXRhVGFibGUgPSB0aGlzLmNoYXJ0RGF0YS5kYXRhVGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53cmFwcGVyLnNldERhdGFUYWJsZSh0aGlzLmRhdGFUYWJsZSk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0Q2hhcnRUeXBlKHRoaXMuY2hhcnREYXRhLmNoYXJ0VHlwZSk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0T3B0aW9ucyh0aGlzLmNoYXJ0RGF0YS5vcHRpb25zKTtcclxuICAgIHRoaXMud3JhcHBlci5zZXREYXRhU291cmNlVXJsKHRoaXMuY2hhcnREYXRhLmRhdGFTb3VyY2VVcmwpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldFF1ZXJ5KHRoaXMuY2hhcnREYXRhLnF1ZXJ5KTtcclxuICAgIHRoaXMud3JhcHBlci5zZXRSZWZyZXNoSW50ZXJ2YWwodGhpcy5jaGFydERhdGEucmVmcmVzaEludGVydmFsKTtcclxuICAgIHRoaXMud3JhcHBlci5zZXRWaWV3KHRoaXMuY2hhcnREYXRhLnZpZXcpO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlQ2hhcnRFdmVudHMoKTtcclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50cygpO1xyXG5cclxuICAgIGlmICh0aGlzLmZvcm1hdHRlcikge1xyXG4gICAgICB0aGlzLmZvcm1hdERhdGEodGhpcy5kYXRhVGFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMud3JhcHBlci5kcmF3KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBmb3JtYXREYXRhKGRhdGFUYWJsZTogZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKSB7XHJcbiAgICBpZiAodGhpcy5mb3JtYXR0ZXIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICB0aGlzLmZvcm1hdHRlci5mb3JFYWNoKHZhbHVlID0+IHtcclxuICAgICAgICB2YWx1ZS5mb3JtYXR0ZXIuZm9ybWF0KGRhdGFUYWJsZSwgdmFsdWUuY29sSW5kZXgpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVRhYmxlLmdldE51bWJlck9mQ29sdW1ucygpOyBpKyspIHtcclxuICAgICAgICB0aGlzLmZvcm1hdHRlci5mb3JtYXQoZGF0YVRhYmxlLCBpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRSZXNpemVMaXN0ZW5lcigpIHtcclxuICAgIGlmICh0aGlzLmR5bmFtaWNSZXNpemUpIHtcclxuICAgICAgZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpXHJcbiAgICAgICAgLnBpcGUoZGVib3VuY2VUaW1lKDEwMCkpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLm5nT25DaGFuZ2VzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbW92ZUNoYXJ0RXZlbnRzKCkge1xyXG4gICAgZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzLnJlbW92ZUFsbExpc3RlbmVycyh0aGlzLndyYXBwZXIpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0RXZlbnRzKCkge1xyXG4gICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLCAncmVhZHknLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlci5nZXRDaGFydCgpLCAnb25tb3VzZW92ZXInLCBldmVudCA9PiB0aGlzLm1vdXNlZW50ZXIuZW1pdChldmVudCkpO1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIuZ2V0Q2hhcnQoKSwgJ29ubW91c2VvdXQnLCBldmVudCA9PiB0aGlzLm1vdXNlbGVhdmUuZW1pdChldmVudCkpO1xyXG5cclxuICAgICAgdGhpcy5yZWFkeS5lbWl0KCdDaGFydCBSZWFkeScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLCAnZXJyb3InLCBlcnJvciA9PiB0aGlzLmVycm9yLmVtaXQoZXJyb3IpKTtcclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3NlbGVjdCcsICgpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy53cmFwcGVyLmdldENoYXJ0KCkuZ2V0U2VsZWN0aW9uKCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0LmVtaXQoc2VsZWN0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0RXZlbnQob2JqZWN0OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5hZGRMaXN0ZW5lcihvYmplY3QsIGV2ZW50TmFtZSwgY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG4iXX0=