import React from 'react'
import Table from 'react-bootstrap/Table';

export default function AnomalyTable({ tableTitle, filtered_data }) {
    return (
        <div>
            {(filtered_data.length !== 0) &&
                <>
                    <h3 className="text-xl mb-2">{tableTitle}</h3>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>IP</th>
                                <th>Datetime</th>
                                <th>Method</th>
                                <th>Path</th>
                                <th>Protocol</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                filtered_data.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.ip}</td>
                                        <td>{entry.datetime}</td>
                                        <td>{entry.method}</td>
                                        <td>{entry.path}</td>
                                        <td>{entry.protocol}</td>
                                        <td>{entry.status}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </>
            }

        </div>
    )
}
