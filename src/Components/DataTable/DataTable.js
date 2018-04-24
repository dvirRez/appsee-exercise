/* eslint-disable */
//Generic datatable component (receives table mapping, and data array)
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

// DataRow component
function DataRow({ cells, keys, keyValue }) {
    return (
        <Tr key={keyValue}>
            {keys.map( key => (
                <Td key={`${keyValue}-${cells[key]}`}>{cells[key]}</Td>
            ))}
        </Tr>
    );
}

export default function DataTable({ tblMapping, data }) {
    return (
        <Table>
            <Thead>
            <Tr>
                {tblMapping.cols.map(colName => (
                <Th key={colName}>{colName}</Th>
                ))}
            </Tr>
            </Thead>
            <Tbody>
                {data.map( cells => (
                    <DataRow cells={cells} keys={tblMapping.cols}  key={cells[tblMapping.key]} keyValue={cells[tblMapping.key]} />
                ))}
            </Tbody>
        </Table>
    );
}