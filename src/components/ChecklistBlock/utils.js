export const detectColumns = (jsonData) => {
  if (!jsonData.length) return { categoryColumn: null, dataColumns: [] };
  const allPossibleKeys = new Set();
  jsonData.forEach((row) => {
    Object.keys(row).forEach((key) => allPossibleKeys.add(key));
  });

  const allKeys = Array.from(allPossibleKeys);
  const firstDataRow = jsonData.find((row) =>
    Object.keys(row).some((key) => row[key] && row[key].toString().trim() !== ''),
  );
  if (!firstDataRow) return { categoryColumn: null, dataColumns: [] };
  const categoryColumn = allKeys[0];
  const dataColumns = allKeys.slice(1);
  return { categoryColumn, dataColumns };
};

export const groupDataByCategory = (data) => {
  const grouped = {};
  let currentCategory = null;
  const { categoryColumn, dataColumns } = detectColumns(data);
  if (!categoryColumn) {
    return {};
  }
  const dataToProcess = data.slice(2);

  dataToProcess.forEach((row) => {
    const categoryField = row[categoryColumn];

    if (categoryField && categoryField.toString().trim() !== '') {
      // Set the new category
      currentCategory = categoryField.toString().replace(/\r\n/g, ' ').replace(/\n/g, ' ').trim();
      if (!grouped[currentCategory]) {
        grouped[currentCategory] = [];
      }
      const hasAnyData = dataColumns.some((col) => {
        const value = row[col];
        return value && value.toString().trim() !== '';
      });

      if (hasAnyData) {
        const item = {
          no: row[dataColumns[0]] || '',
          item: row[dataColumns[1]] || '',
          result: row[dataColumns[2]] || '',
        };
        grouped[currentCategory].push(item);
      }
    } else if (currentCategory) {
      // Process rows that only contain data (no category)
      const columnData = {};
      dataColumns.forEach((col) => {
        columnData[col] = row[col];
      });
      const hasAnyData = dataColumns.some((col) => {
        const value = row[col];
        return value && value.toString().trim() !== '';
      });
      if (hasAnyData) {
        const item = {
          no: row[dataColumns[0]] || '',
          item: row[dataColumns[1]] || '',
          result: row[dataColumns[2]] || '',
        };

        grouped[currentCategory].push(item);
      } else {
        console.log('× No data found in data columns, skipping row');
      }
    } else {
      console.log('× No current category, skipping row');
    }
  });
  return grouped;
};
