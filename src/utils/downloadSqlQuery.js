function downloadSqlQuery(sql, databaseName) {
  const blob = new Blob([sql], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${databaseName}.sql`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default downloadSqlQuery;