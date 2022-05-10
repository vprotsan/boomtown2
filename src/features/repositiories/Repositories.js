import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { allRepositories, allRepositoriesStatus, allRepositoriesError, getRepositoriesAsync } from './repositoriesSlice';
import { useParams } from 'react-router-dom';
import styles from './Repositories.module.scss';
import { Table } from '../table/Table';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';


export function Repositories() {

    let organizationIndex = parseInt((useParams()).id);
    let organizationName = useSelector(store => store.organization.configs[organizationIndex].name);
    const repositoryURL = useSelector(store => store.organization.configs[organizationIndex].repos_url);

    const dispatch = useDispatch();
    const repositoriesArray = useSelector(allRepositories);
    const repositoriesArrayStatus = useSelector(allRepositoriesStatus);
    const repositoriesArrayError = useSelector(allRepositoriesError);

    if(repositoriesArrayStatus.toLowerCase() === 'idle'){
        dispatch(getRepositoriesAsync(repositoryURL));
    }

    const isLastestDate = (date1, date2) => {
      return new Date(date1).valueOf() > new Date(date2).valueOf()
    }

    const displayTimeString = string => {
        let str = string.slice(0, string.length - 1);
        return str.split('T')[0] + "\n at " + str.split('T')[1];
    }

    let repoRows = repositoriesArray.map(each => {
        return {
            "id": each.id,
            "name": each.name,
            "description": each.description,
            "language": each.language,
            "team": each.teams_url,
            "isPrivate": each.private ? "Yes" : "No",
            "createdAt": each.created_at,
            "updatedAt": each.updated_at,
            "htmlUrl": each.html_url
        }
    })

    const columns = React.useMemo(
        () => [
          {
            Header: 'Name',
            accessor: row => row.name.toLowerCase(),
            Cell: cell => <a href={cell.row.original.htmlUrl} className={styles.name}>{cell.value ? cell.value : " "}</a>
          },
          {
            Header: 'Description',
            accessor: row => row.description,
            Cell: cell => <span className={styles.description}>{cell.value ? cell.value : " "}</span>
          },
          {
            Header: 'Language',
            accessor: row => row.language,
            Cell: cell => <span className={styles.language}>{cell.value ? cell.value : " "}</span>
          },
          {
            Header: 'Team',
            accessor: row => row.team,
            Cell: () => <button className={styles.button}>Team</button>
          },
          {
            Header: 'Is Private',
            accessor: 'isPrivate'
          },
          {
            Header: 'Created At',
            accessor: row => row.createdAt,
            Cell: (row) => <span className={ isLastestDate(row.row.original.createdAt, row.row.original.updatedAt) 
                                            ? styles.lastUpdated 
                                            : styles.date }>
                                              {displayTimeString(row.value)}
                                            </span>
          },
          {
            Header: 'Updated At',
            accessor: row => row.updatedAt,
            Cell: (row) => <span className={ isLastestDate(row.row.original.updatedAt, row.row.original.createdAt) 
                                            ? styles.lastUpdated 
                                            : styles.date }>
                                              {displayTimeString(row.value)}
                                            </span>
          },
          {
            Header: 'ID',
            accessor: 'id'
          },
        ],
        []
    )

    let data = React.useMemo(() =>
            [...repoRows], 
            [repoRows] 
    )

    const sortBy = [{ id: "name" }, { id: "createdAt" }, { id: "updatedAt" }];

    const renderDisplayElement = (componentStatus) => {

      switch(componentStatus){
        case 'loading':
        case 'idle':
          return <Loading />
        case 'successful':
          return <>
                <h1>{organizationName} repositories: </h1>
                <Table columns={columns} data={data} sortBy={sortBy} headerStyle="repos"/>
              </>
        case 'failed':
          return repositoriesArrayError 
                ? <Error msg= {repositoriesArrayError}/> 
                : <Error msg="Sorry there was a problem :(  But we are on our way to fix it!"/>
      }
    }

    return (
      renderDisplayElement(repositoriesArrayStatus)
    )
}