import * as React from 'react';
import { cleanup, render, fireEvent, screen, act } from '@testing-library/react';
import { create } from 'react-test-renderer';
import { TableOutputComponent } from '../table-output-component';
import { CellRenderer, LoadingRenderer, SearchFilterRenderer } from '../table-renderer-components';
import { AbstractOutputProps } from '../abstract-output-component';
import { TimeGraphUnitController } from 'timeline-chart/lib/time-graph-unit-controller';
import { TimeRange } from 'traceviewer-base/lib/utils/time-range';
import { HttpTspClient } from 'tsp-typescript-client/lib/protocol/http-tsp-client';
import {
    ColDef,
    Column,
    GridApi,
    IRowModel,
    IRowNode,
    RowNode,
    ValueGetterParams
} from '@ag-grid-community/core';
import { jest } from '@jest/globals';

describe('<TableOutputComponent />', () => {
    let tableComponent: any;
    const ref = (el: TableOutputComponent | undefined | null): void => {
        tableComponent = el;
    };

    beforeEach(() => {
        tableComponent = null;
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    test('Renders AG-Grid table with provided props & state', async () => {
        const tableOutputComponentProps: AbstractOutputProps = {
            tooltipComponent: null,
            style: {
                width: 0,
                height: 0,
                rowHeight: 0,
                naviBackgroundColor: 0,
                chartBackgroundColor: 0,
                cursorColor: 0,
                lineColor: 0,
                componentLeft: 0,
                chartOffset: 0
            },
            tspClient: new HttpTspClient('testURL'),
            traceId: '0',
            outputDescriptor: {
                id: '0',
                name: '',
                description: '',
                type: '',
                queryParameters: new Map<string, any>(),
                start: BigInt(0),
                end: BigInt(0),
                final: true,
                compatibleProviders: []
            },
            markerCategories: undefined,
            markerSetId: '0',
            range: new TimeRange(BigInt(0), BigInt(0)),
            nbEvents: 0,
            viewRange: new TimeRange(BigInt(0), BigInt(0)),
            selectionRange: undefined,
            onOutputRemove: () => 0,
            unitController: new TimeGraphUnitController(BigInt(0), { start: BigInt(0), end: BigInt(0) }),
            backgroundTheme: 'light',
            tooltipXYComponent: null,
            outputWidth: 0
        };

        const tableOutputComponentState = [
            {
                headerName: 'Trace',
                field: '0',
                width: 0,
                resizable: true,
                cellRenderer: 'cellRenderer',
                cellRendererParams: { filterModel: {}, searchResultsColor: '#cccc00' },
                suppressMenu: true,
                filter: 'agTextColumnFilter',
                floatingFilter: true,
                floatingFilterComponent: 'searchFilterRenderer',
                floatingFilterComponentParams: { suppressFilterButton: true, colName: '0' },
                icons: { filter: '' },
                tooltipField: '0'
            }
        ];

        const { container } = render(<TableOutputComponent {...tableOutputComponentProps} ref={ref} />);
        expect(tableComponent).toBeTruthy();
        expect(tableComponent instanceof TableOutputComponent).toBe(true);
        const table: TableOutputComponent = tableComponent;
        act(() => {
            // fire events that update state
            table.setState({ tableColumns: tableOutputComponentState });
        });

        // Renders with provided props
        expect(table.state.tableColumns).toEqual(tableOutputComponentState);
        expect(table.props.backgroundTheme).toEqual('light');
        expect(table.props.tooltipComponent).toEqual(null);
        expect(table.props.style).toEqual({
            width: 0,
            height: 0,
            rowHeight: 0,
            naviBackgroundColor: 0,
            chartBackgroundColor: 0,
            cursorColor: 0,
            lineColor: 0,
            componentLeft: 0,
            chartOffset: 0
        });
        expect(container).toMatchSnapshot();
    });

    const mockOnFilterChange = jest.fn();
    const mockOnClickNext = jest.fn<() => Promise<boolean>>(() => Promise.resolve(true));
    const mockOnClickPrevious = jest.fn<() => Promise<boolean>>(() => Promise.resolve(true));
    const mockParentilterInstance = jest.fn();
    const mockCurrentParentModel = jest.fn();
    const mockFilterChangedCallback = jest.fn();
    const mockFilterModifiedCallback = jest.fn();

    const mockValueGetter = jest.fn((params: ValueGetterParams<any, any>) => {
        return 'mockedValue';
    });
    const mockGetValue = jest.fn((node: IRowNode<any>, column?: string | ColDef<any, any> | Column<any>) => {
        return 'mockedCellValue';
    });
    const mockDoesRowPassOtherFilter = jest.fn((rowNode: RowNode) => true) as jest.MockInstance<boolean, [any]> &
        ((rowNode: any) => boolean);
    const mockShowParentFilter = jest.fn();
    const mockColumn: Partial<jest.Mocked<Column<any>>> = {
        getColId: jest.fn(() => 'mockedColId') as jest.MockInstance<string, []> & (() => string), 
        getUserProvidedColDef: jest.fn(() => null) as jest.MockInstance<null, []> & (() => null),
        isPrimary: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        isFilterAllowed: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        isRowGroupDisplayed: jest.fn((colId: string) => false) as jest.MockInstance<boolean, [string]> & ((colId: string) => boolean),
        // isTooltipEnabled: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // addEventListener: jest.fn((eventType: any, userListener: any) => {}) as jest.MockInstance<void, [any, any]> & ((eventType: any, userListener: any) => void),
        // removeEventListener: jest.fn((eventType: any, userListener: any) => {}) as jest.MockInstance<void, [any, any]> & ((eventType: any, userListener: any) => void),
        // isSuppressNavigable: jest.fn((rowNode: RowNode) => false) as jest.MockInstance<boolean, [any]> & ((rowNode: any) => boolean),
        // isCellEditable: jest.fn((rowNode: RowNode) => true) as jest.MockInstance<boolean, [any]> & ((rowNode: any) => boolean),
        // isSuppressFillHandle: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAutoHeight: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAutoHeaderHeight: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isRowDrag: jest.fn((rowNode: RowNode) => false) as jest.MockInstance<boolean, [any]> & ((rowNode: any) => boolean),
        // isDndSource: jest.fn((rowNode: RowNode) => false) as jest.MockInstance<boolean, [any]> & ((rowNode: any) => boolean),
        // isCellCheckboxSelection: jest.fn((rowNode: RowNode) => false) as jest.MockInstance<boolean, [any]> & ((rowNode: any) => boolean),
        // isSuppressPaste: jest.fn((rowNode: RowNode) => false) as jest.MockInstance<boolean, [any]> & ((rowNode: any) => boolean),
        // isMenuVisible: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // getSort: jest.fn(() => 'asc') as jest.MockInstance<'asc' | 'desc' | undefined, []> & (() => 'asc' | 'desc' | undefined),
        // isSortable: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // isSortAscending: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // isSortDescending: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isSortNone: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isSorting: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // getSortIndex: jest.fn(() => null) as jest.MockInstance<number | null | undefined, []> & (() => number | null | undefined),
        // getAggFunc: jest.fn(() => null) as jest.MockInstance<string | undefined | null, []> & (() => string | undefined | null),
        // getRight: jest.fn(() => 100) as jest.MockInstance<number, []> & (() => number),
        // isFilterActive: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isHovered: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isFirstRightPinned: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isLastLeftPinned: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isPinned: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isPinnedLeft: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isPinnedRight: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isSpanHeaderHeight: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // getColumnGroupPaddingInfo: jest.fn(() => ({ numberOfParents: 1, isSpanningTotal: true })) as jest.MockInstance<{ numberOfParents: number; isSpanningTotal: boolean }, []> & (() => { numberOfParents: number; isSpanningTotal: boolean }),
        // getColDef: jest.fn(() => ({}) as any) as jest.MockInstance<any, []> & (() => any),
        // getAutoHeaderHeight: jest.fn(() => null) as jest.MockInstance<number | null, []> & (() => number | null),
        // getColSpan: jest.fn((rowNode: RowNode) => 1) as jest.MockInstance<number, [any]> & ((rowNode: any) => number),
        // getRowSpan: jest.fn((rowNode: RowNode) => 1) as jest.MockInstance<number, [any]> & ((rowNode: any) => number),
        // isGreaterThanMax: jest.fn((wifth: number) => false) as jest.MockInstance<boolean, [number]> & ((width: number) => boolean),
        // getMaxWidth: jest.fn(() => 100) as jest.MockInstance<number, []> & (() => number),
        // getFlex: jest.fn(() => 1) as jest.MockInstance<number, []> & (() => number),
        // isRowGroupActive: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isPivotActive: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAnyFunctionActive: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAnyFunctionAllowed: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isValueActive: jest.fn(() => false) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAllowPivot: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAllowValue: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        // isAllowRowGroup: jest.fn(() => true) as jest.MockInstance<boolean, []> & (() => boolean),
        isColumn: true
    };

    const mockGridApi: Partial<jest.Mocked<GridApi>> = {
        getSelectedRows: jest.fn(() => []) as jest.MockInstance<any[], []> & (() => any[]),
        getDisplayedRowCount: jest.fn(() => 100) as jest.MockInstance<number, []> & (() => number),
        getDisplayedRowAtIndex: jest.fn(index => ({ id: index })) as jest.MockInstance<any, [number]> & ((index: number) => any),
        getRowNode: jest.fn(id => ({ id })) as jest.MockInstance<any, [string]> & ((id: string) => any),
        refreshCells: jest.fn(() => {}) as jest.MockInstance<void, []> & (() => void),
        sizeColumnsToFit: jest.fn(() => {}) as jest.MockInstance<void, []> & (() => void),
        redrawRows: jest.fn(() => {}) as jest.MockInstance<void, []> & (() => void),
        selectAll: jest.fn(() => {}) as jest.MockInstance<void, []> & (() => void),
        deselectAll: jest.fn(() => {}) as jest.MockInstance<void, []> & (() => void),
        setFilterModel: jest.fn(filterModel => {}) as jest.MockInstance<void, [any]> & ((filterModel: any) => void),
        getFilterModel: jest.fn(() => ({ filter: 'test' })) as jest.MockInstance<any, []> & (() => any),
        exportDataAsCsv: jest.fn(() => {}) as jest.MockInstance<void, []> & (() => void),
    };
    

    test('Empty search filter renderer', () => {
        const searchFilter = create(
            <SearchFilterRenderer
                colName={'jest Test'}
                onFilterChange={mockOnFilterChange}
                onclickNext={mockOnClickNext}
                onclickPrevious={mockOnClickPrevious}
                // column={new Column({} as ColDef, {} as ColDef, 'jest Test', true)}
                column = {mockColumn as jest.Mocked<Column<any>>}
                filterParams={{
                    api: mockGridApi as jest.Mocked<GridApi<any>>,
                    column: mockColumn as jest.Mocked<Column<any>>,
                    colDef: {} as ColDef,
                    rowModel: '' as unknown as IRowModel,
                    filterChangedCallback: mockFilterChangedCallback,
                    filterModifiedCallback: mockFilterModifiedCallback,
                    valueGetter: mockValueGetter,
                    // @ts-ignore
                    getValue: mockGetValue,
                    doesRowPassOtherFilter: mockDoesRowPassOtherFilter,
                    context: ''
                }}
                currentParentModel={mockCurrentParentModel}
                parentFilterInstance={mockParentilterInstance}
                suppressFilterButton={false}
                // api = {mockGridApi as jest.Mocked<GridApi<any>>}
                showParentFilter={mockShowParentFilter}
                context={''}
                filterModel={new Map<string, string>()}
            />
        ).toJSON();
        // console.log(JSON.stringify(searchFilter));
        // JSON.stringify(searchFilter)
        expect(searchFilter).toMatchSnapshot();
    });

    test('Search filter renderer key interactions', () => {
        render(
            <SearchFilterRenderer
                colName={'jest Test'}
                onFilterChange={mockOnFilterChange}
                onclickNext={mockOnClickNext}
                onclickPrevious={mockOnClickPrevious}
                // column = {mockColumn as jest.Mocked<Column<any>>}
                filterParams={{
                    api: mockGridApi as jest.Mocked<GridApi<any>>,
                    // column: mockColumn as jest.Mocked<Column<any>>,
                    colDef: {} as ColDef,
                    rowModel: '' as unknown as IRowModel,
                    filterChangedCallback: mockFilterChangedCallback,
                    filterModifiedCallback: mockFilterModifiedCallback,
                    valueGetter: mockValueGetter,
                    // @ts-ignore
                    getValue: mockGetValue,
                    doesRowPassOtherFilter: mockDoesRowPassOtherFilter,
                    context: ''
                }}
                currentParentModel={mockCurrentParentModel}
                parentFilterInstance={mockParentilterInstance}
                suppressFilterButton={false}
                // api = {mockGridApi as jest.Mocked<GridApi<any>>}
                showParentFilter={mockShowParentFilter}
                context={''}
                filterModel={new Map<string, string>()}
            />
        );

        const parentDiv = screen.getByTestId('search-filter-element-parent');
        fireEvent.click(parentDiv);
        const input = screen.getByTestId('search-filter-element-input');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(mockOnClickNext).toHaveBeenCalledTimes(1);
        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape', charCode: 27 });
        expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    });

    const cellRendererProps: any = {
        value: 'test cell',
        valueFormatted: 'test cell',
        getValue: function () {
            return 'test cell';
        },
        setValue: function (val: any): void {
            const value = val;
        },
        formatValue: function (value: any) {
            return value;
        },
        data: {},
        node: {} as RowNode,
        colDef: {} as ColDef,
        column: mockColumn,
        rowIndex: 0,
        api: mockGridApi,
        // columnApi: new ColumnApi(),
        context: '',
        refreshCell: () => {},
        $scope: '',
        eGridCell: document.createElement('div'),
        eParentOfValue: document.createElement('div'),
        addRenderedRowListener: function (eventType: string, listener: Function): void {
            throw new Error('Function not implemented.');
        },
        searchResultsColor: '#FFFF00',
        filterModel: new Map<string, string>()
    };

    test('Cell renderer', () => {
        const cellRenderer = create(<CellRenderer {...cellRendererProps} />).toJSON();
        expect(cellRenderer).toMatchSnapshot();
    });

    test('Cell renderer with search selection', () => {
        cellRendererProps.colDef.field = 'testField';
        cellRendererProps.filterModel.set('testField', 'test');
        cellRendererProps.data = { isMatched: true };

        const cellRenderer = create(<CellRenderer {...cellRendererProps} />).toJSON();
        expect(cellRenderer).toMatchSnapshot();
    });

    test('Loading renderer not loading', () => {
        delete cellRendererProps.filterModel;
        delete cellRendererProps.searchResultsColor;

        const loadingRenderer = create(<LoadingRenderer {...cellRendererProps} />).toJSON();
        expect(loadingRenderer).toMatchSnapshot();
    });

    test('Loading renderer in loading', () => {
        cellRendererProps.value = undefined;

        const loadingRenderer = create(<LoadingRenderer {...cellRendererProps} />).toJSON();
        expect(loadingRenderer).toMatchSnapshot();
    });
});

