// parser.js
// Parses data from various formats (e.g., CSV, JSON) to a standardized internal data structure.

/**
 * Parses CSV data into an array of objects.
 * @param {string} csvData - The CSV data as a string.
 * @param {object} options - Optional configuration options.
 * @param {string} options.delimiter - The delimiter used in the CSV data (default: ',').
 * @param {boolean} options.header - Whether the first row is a header row (default: true).
 * @returns {Array<object>} An array of objects representing the parsed CSV data. Returns an empty array if parsing fails.
 */
export function parseCSV(csvData, options = {}) {
  try {
    const delimiter = options.delimiter || ',';
    const header = options.header !== false; // Default to true if not explicitly false
    const lines = csvData.trim().split('\n');

    if (lines.length === 0) {
      return [];
    }

    const headers = header ? lines.shift().split(delimiter).map(h => h.trim()) : null;
    const data = [];

    for (const line of lines) {
      const values = line.split(delimiter).map(v => v.trim());

      if (headers) {
        if (values.length !== headers.length) {
          console.warn("CSV row has a different number of columns than the header. Skipping row.");
          continue; // Skip rows with incorrect column count
        }
        const obj = {};
        for (let i = 0; i < headers.length; i++) {
          obj[headers[i]] = values[i];
        }
        data.push(obj);
      } else {
        data.push(values); // If no header, return an array of arrays
      }
    }

    return data;
  } catch (error) {
    console.error("Error parsing CSV data:", error);
    return [];
  }
}

/**
 * Parses JSON data into a JavaScript object.
 * @param {string} jsonData - The JSON data as a string.
 * @returns {object|Array<any>|null} The parsed JSON object or array. Returns null if parsing fails.
 */
export function parseJSON(jsonData) {
  try {
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return null;
  }
}

/**
 * Standardizes data into a common format.
 * @param {Array<object>} data - The data to standardize.
 * @param {object} schema - A schema object defining the expected structure of the data.
 * @returns {Array<object>} The standardized data.  If an error occurs, returns an empty array.
 */
export function standardizeData(data, schema) {
  try {
    if (!Array.isArray(data)) {
      console.warn("Data is not an array. Returning empty array.");
      return [];
    }

    if (!schema || typeof schema !== 'object') {
      console.warn("Invalid schema. Returning original data.");
      return data;
    }

    const standardizedData = data.map(item => {
      const newItem = {};
      for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
          const sourceKey = schema[key];
          newItem[key] = item[sourceKey] !== undefined ? item[sourceKey] : null; // Use null for missing values
        }
      }
      return newItem;
    });

    return standardizedData;
  } catch (error) {
    console.error("Error standardizing data:", error);
    return [];
  }
}