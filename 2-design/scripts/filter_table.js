/**
 * Returns the values from one CSV column for rows matching three columns.
 *
 * Example:
 *   getColumnValues(csv, "strategies", {
 *     type: "true",
 *     level: "low",
 *     country: "FR"
 *   });
 */
function getColumnValues(csv, valueColumn, conditions) {
	const rows = parseCsv(csv);
	if (rows.length < 2) return [];

	const headers = rows[0].map((header) => header.trim());
	const valueIndex = headers.indexOf(valueColumn);
	const conditionEntries = Object.entries(conditions);

	if (valueIndex === -1 || conditionEntries.length !== 3) {
		throw new Error("The value column must exist and exactly three conditions are required.");
	}

	const conditionIndexes = conditionEntries.map(([column]) => {
		const index = headers.indexOf(column);
		if (index === -1) throw new Error(`Unknown CSV column: ${column}`);
		return index;
	});

	return rows.slice(1)
		.filter((row) => conditionEntries.every(([, expected], index) =>
			row[conditionIndexes[index]] === String(expected)
		))
		.map((row) => row[valueIndex]);
}

function parseCsv(csv) {
	const rows = [];
	let row = [];
	let field = "";
	let quoted = false;

	for (let index = 0; index < csv.length; index += 1) {
		const character = csv[index];
		if (character === '"') {
			if (quoted && csv[index + 1] === '"') {
				field += '"';
				index += 1;
			} else {
				quoted = !quoted;
			}
		} else if (character === "," && !quoted) {
			row.push(field.trim());
			field = "";
		} else if ((character === "\n" || character === "\r") && !quoted) {
			if (character === "\r" && csv[index + 1] === "\n") index += 1;
			row.push(field.trim());
			if (row.some((value) => value !== "")) rows.push(row);
			row = [];
			field = "";
		} else {
			field += character;
		}
	}

	if (field || row.length) {
		row.push(field.trim());
		rows.push(row);
	}
	return rows;
}

module.exports = { getColumnValues };
