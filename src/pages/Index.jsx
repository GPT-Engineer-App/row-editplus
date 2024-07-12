import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parse, unparse } from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedData = parse(text, { header: true });
        setHeaders(parsedData.meta.fields);
        setCsvData(parsedData.data);
      };
      reader.readAsText(file);
    }
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][column] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = "";
      return acc;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleDownloadCSV = () => {
    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">CSV Management Tool</h1>
        <p className="text-lg">Upload, view, and edit your CSV files with ease.</p>
      </header>
      <section className="mb-8">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csvUpload"
        />
        <label htmlFor="csvUpload">
          <Button variant="outline">Upload CSV</Button>
        </label>
      </section>
      <section className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    <Input
                      value={row[header]}
                      onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outline" onClick={handleAddRow} className="mt-4">
          Add Row
        </Button>
      </section>
      <section>
        <Button variant="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </section>
    </div>
  );
};

export default Index;