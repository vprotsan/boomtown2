import { useTable, useSortBy } from 'react-table';
import styles from './Table.module.scss';

export function Table({ columns, data, sortBy, headerStyle }) {

    let headerClass = styles[`${headerStyle}`];

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      setSortBy,
      prepareRow
    } = useTable(
      {
        columns,
        data,
        initialState: { sortBy }
      },
      useSortBy
    );
  
    return (
        <table {...getTableProps()} className={styles.table}>
            <thead className={headerClass}>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} className={styles.tableHeaderCell}
                            onClick={() => {
                                const desc =
                                    column.isSortedDesc === true
                                    ? undefined
                                    : column.isSortedDesc === false
                                    ? true
                                    : false;
                                setSortBy([{ id: column.id, desc }, ...sortBy]);
                        }}>
                        <span>
                            {column.render("Header")}
                            {column.isSorted
                                ? column.isSortedDesc
                                ? "  ▲ "
                                : "  ▼ "
                                : ""}
                        </span>
                        </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                                <td className={styles.tableCell} {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                </td>
                            )
                        })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}