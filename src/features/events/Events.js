import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { allEvents, allEventsStatus, allEventsError, getEventsAsync } from "./eventsSlice";
import { Table } from '../table/Table';
import styles from './Events.module.scss';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';

export function Events() {

    let organizationIndex = parseInt((useParams()).id);
    let organizationName = useSelector(store => store.organization.configs[organizationIndex].name);
    const eventsURL = useSelector(store => store.organization.configs[organizationIndex].events_url);

    const dispatch = useDispatch();
    const eventsArray = useSelector(allEvents);
    const eventsArrayStatus = useSelector(allEventsStatus);
    const eventsArrayError = useSelector(allEventsError);

    if(eventsArrayStatus.toLowerCase() == 'idle'){
        dispatch(getEventsAsync(eventsURL));
    }

    const displayTimeString = string => {
        let str = string.slice(0, string.length - 1);
        return str.split('T')[0] + "\n at " + str.split('T')[1];
    }

    let eventRows = eventsArray.map(each => {
        return {
            "avatar": each.actor.avatar_url,
            "type": each.type,
            "isPublic": each.public ? "Yes" : "No",
            "createdAt": each.created_at,
            "id": each.id,
            "repoName": each.repo.name,
            "repoUrl": each.repo.url
        }
    })

    const columns = React.useMemo(
        () => [
          {
            Header: 'Avatar',
            accessor: row => row.avatar,
            Cell: (cell) => <img className={styles.cellImage} src={cell.value} alt={cell.column.Header} />
          },
          {
            Header: 'Type',
            accessor: cell => cell.type,
            Cell: cell => <span className={styles.eventsType}> { cell.value } </span>
          },
          {
            Header: 'Public',
            accessor: 'isPublic'
          },
          {
            Header: 'Created At',
            accessor: row => row.createdAt,
            Cell: row => <span className={styles.createdAt}>{ displayTimeString(row.value)}</span>
          },
          {
            Header: 'Id',
            accessor: row => row.id,
            Cell: row => <span className={styles.id}>{ row.value }</span>,
          },
          {
            Header: 'Name',
            accessor: row => row.repoName,
            Cell: cell => <a href={cell.row.original.html_url} className={styles.name}> { cell.value } </a>
          }
        ],
        []
    )

    let data = React.useMemo(() =>
            [...eventRows], 
            [eventRows] 
    )

    const sortBy = [{ id: "type" }, { id: "createdAt" }];

    const renderDisplayElement = (componentStatus) => {

      switch(componentStatus){
        case 'loading':
        case 'idle':
          return <Loading />
        case 'successful':
          return <>
                <h1>{organizationName} events:</h1>
                <Table columns={columns} data={data} sortBy={sortBy} headerStyle="events"/>
              </>
        case 'failed':
          return eventsArrayError 
                ? <Error msg= {eventsArrayError}/> 
                : <Error msg="Sorry there was a problem :(  But we are on our way to fix it!"/>
      }
    }

    return (
      renderDisplayElement(eventsArrayStatus)
    )
}