import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { allIssues, allIssuesStatus, allIssuesError, getIssuesAsync } from "./issuesSlice";
import { Table } from '../table/Table';
import styles from '../../index.module.scss';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';

export function Issues() {

    let organizationIndex = parseInt((useParams()).id);
    let organizationName = useSelector(store => store.organization.configs[organizationIndex].name);
    const issuesURL = useSelector(store => store.organization.configs[organizationIndex].issues_url);

    const dispatch = useDispatch();
    const issuesArray = useSelector(allIssues);
    const issuesArrayStatus = useSelector(allIssuesStatus);
    const issuesArrayError = useSelector(allIssuesError);

    if(issuesArrayStatus.toLowerCase() == 'idle'){
        dispatch(getIssuesAsync(issuesURL));
    }

    const displayTimeString = string => {
        let str = string.slice(0, string.length - 1);
        return str.split('T')[0] + "\n at " + str.split('T')[1];
    }

    let issueRows = issuesArray.map(each => {
        return {
            "avatar": each.actor.avatar_url,
            "type": each.type,
            "isPublic": each.public ? "Yes" : "No",
            "createdAt": each.created_at
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
            accessor: 'type'
          },
          {
            Header: 'Public',
            accessor: 'isPublic'
          },
          {
            Header: 'Created At',
            accessor: row => displayTimeString(row.createdAt)
          }
        ],
        []
    )

    let data = React.useMemo(() =>
            [...issueRows], 
            [issueRows] 
    )

    const sortBy = [{ id: "type" }, { id: "createdAt" }];

    const renderDisplayElement = (componentStatus) => {

        switch(componentStatus){
          case 'loading':
          case 'idle':
            return <Loading />
          case 'successful':
            return <>
                  <h1>{organizationName} issues: </h1>
                  <Table columns={columns} data={data} sortBy={sortBy} headerStyle="issues"/>
                </>
          case 'failed':
            return issuesArrayError 
                  ? <Error msg= {issuesArrayError}/> 
                  : <Error msg="Sorry there was a problem :(  But we are on our way to fix it!"/>
        }
    }

    return (
        renderDisplayElement(issuesArrayStatus)
    )
}