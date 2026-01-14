import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

function GeneratedTable({ table }) {
  if (!table || !table.items || _.isEmpty(table.items)) {
    return null;
  }

  const tableItem = table.items[0];

  if (!tableItem.areas || _.isEmpty(tableItem.areas)) {
    return null;
  }

  const getCellContent = (area) => {
    const cell = area.items?.[0];
    if (!cell || !cell.content) return null;
    const { content } = cell;
    const { properties } = content;

    return {
      content: properties?.content || '',
      columnSpan: area.columnSpan || 1,
      rowSpan: area.rowSpan || 1,
      id: content.id,
      isHeader: properties.header,
    };
  };

  const gridCells = tableItem.areas.map(getCellContent).filter(Boolean);

  const getGridStyle = (cell) => {
    const style = {};

    if (cell.columnSpan > 1) {
      style.gridColumn = `span ${cell.columnSpan}`;
    }
    if (cell.rowSpan > 1) {
      style.gridRow = `span ${cell.rowSpan}`;
    }

    return style;
  };

  const getJustifyClass = (markup) => {
    if (markup.includes('text-align: center') || markup.includes('text-align:center')) {
      return 'justify-center px-0';
    } else if (markup.includes('text-align: right') || markup.includes('text-align:right')) {
      return 'justify-end pr-4';
    } else if (markup.includes('text-align: left') || markup.includes('text-align:left')) {
      return 'justify-start pl-4';
    }
    return 'justify-start pl-4';
  };

  const columnCount = tableItem.areaGridColumns || 8;

  return (
    <div className="w-full overflow-x-auto border border-grey">
      <div
        className="grid min-h-12 w-full gap-px bg-white text-sm shadow-sm md:min-w-0"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          gridAutoRows: 'minmax(3rem, auto)',
          minWidth: 'max-content',
        }}>
        {gridCells.map((cell, index) => (
          <div
            key={cell.id || index}
            className={classNames(
              'flex min-w-0 items-center py-2 outline outline-1 outline-grey',
              cell.isHeader ? 'bg-porcelain' : 'bg-white',
              getJustifyClass(cell.content.markup || ''),
            )}
            style={{
              ...getGridStyle(cell),
            }}
            dangerouslySetInnerHTML={{ __html: cell.content.markup || '' }}
          />
        ))}
      </div>
    </div>
  );
}

export default GeneratedTable;
