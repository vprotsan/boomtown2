import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrganizationConfig, selectOrganizationStatus, selectOrganizationError, getOrganizationConfigAsync } from './organizationSlice';
import { render } from '@testing-library/react';
import styles from './Organization.module.scss';
import { Link } from 'react-router-dom';
import { Table } from '../table/Table';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';


export function Organization() {

    const dispatch = useDispatch();
    const organizationConfigs = useSelector(selectOrganizationConfig);
    const organizationStatus = useSelector(selectOrganizationStatus);
    const organizationError = useSelector(selectOrganizationError);

    if(organizationStatus.toLowerCase() === 'idle'){
        dispatch(getOrganizationConfigAsync());
    }

    const displayTimeString = string => {
        let str = string.slice(0, string.length - 1);
        return str.split('T')[0] + "\n at " + str.split('T')[1];
    }

    const isLastestDate = (date1, date2) => {
      return new Date(date1).valueOf() > new Date(date2).valueOf()
    }

    const columns = React.useMemo(
        () => [
          {
            Header: 'ID',
            accessor: 'id',
          },
          {
            Header: 'Avatar',
            accessor: row => row.avatar,
            Cell: (cell) => <img className={styles.avatar} src={cell.cell.value} alt={cell.row.original.name}/>
          },
          {
            Header: 'Name',
            accessor: row => row.name,
            Cell: (cell) => <a href={cell.row.original.htmlUrl} target="_blank" rel="noopener noreferrer" >{cell.cell.value}</a>
          },
          {
            Header: 'Type',
            accessor: 'type',
          },
          {
            Header: 'Repos',
            accessor: row => row.repos,
            Cell: (cell) => {
                let path = `/organizations/${cell.row.index}/repos`;
                return <Link to={path}>All Repos</Link>
            }
          },
          {
            Header: 'Events',
            accessor: row => row.events,
            Cell: (cell) => {
                let path = `/organizations/${cell.row.index}/events`;
                return <Link to={path}>All Events</Link>
            }
          },
          {
            Header: 'Hooks',
            accessor: row => row.hooks,
            Cell: (cell) => {
                let path = `/organizations/${cell.row.index}/hooks`;
                return <Link to={path}>All Hooks</Link>
            }
          },
          {
            Header: 'Issues',
            accessor: row => row.issues,
            Cell: (cell) => {
                let path = `/organizations/${cell.row.index}/issues`;
                return <Link to={path}>All Issues</Link>
            }
          },
          {
            Header: 'Members',
            accessor: row => row.members,
            Cell: (cell) => {
                let path = `/organizations/${cell.row.index}/members`;
                return <Link to={path}>All Members</Link>
            }
          },
          {
            Header: 'Is Verified?',
            accessor: 'isVerified',
          },
          {
            Header: 'Created',
            accessor: row => row.createdAt,
            Cell: (row) => <span className={ isLastestDate(row.row.original.createdAt, row.row.original.updatedAt) 
                                            ? styles.lastUpdated 
                                            : styles.date }>
                                              {displayTimeString(row.value)}
                                            </span>
          },
          {
            Header: 'Updated',
            accessor: row => row.updatedAt,
            Cell: (row) => <span className={ isLastestDate(row.row.original.updatedAt, row.row.original.createdAt) 
                                            ? styles.lastUpdated 
                                            : styles.date }>
                                              {displayTimeString(row.value)}
                                            </span>
          }
        ],
        []
    )

    let organizationRows = organizationConfigs.map(each => {
        return {
            "id": each.id,
            "avatar": each.avatar_url,
            "name": each.name,
            "type": each.type,
            "htmlUrl": each.html_url,
            "repos": each.repos_url,
            "events": each.events_url,
            "hooks": each.hooks_url,
            "issues": each.issues_url,
            "members": each.members_url,
            "isVerified": each.is_verified ? "Yes" : "No",
            "createdAt": each.created_at,
            "updatedAt": each.updated_at
        }
    })

    let data = React.useMemo(() =>
            [...organizationRows], 
            [organizationRows] 
    )

    const sortBy = [{ id: "name" }, { id: "createdAt" }, { id: "updatedAt" }];

    const renderDisplayElement = (componentStatus) => {

      switch(componentStatus){
        case 'loading':
        case 'idle':
          return <Loading />
        case 'successful':
          return <>
                <h1>Organizations</h1>
                <Table columns={columns} data={data} sortBy={sortBy} headerStyle="orgs"/>
              </>
        case 'failed':
          return organizationError 
                ? <Error msg= {organizationError}/> 
                : <Error msg="Sorry there was a problem :(  But we are on our way to fix the problem!"/>
      }
    }

    return (
      renderDisplayElement(organizationStatus)
    )
}