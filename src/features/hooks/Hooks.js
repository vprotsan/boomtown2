import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { allHooks, allHooksStatus, allHooksError, getHooksAsync } from "./hooksSlice";
import { Table } from '../table/Table';
import styles from './Hooks.module.scss';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';

export function Hooks() {

    let organizationIndex = parseInt((useParams()).id);
    let organizationName = useSelector(store => store.organization.configs[organizationIndex].name);
    const hooksURL = useSelector(store => store.organization.configs[organizationIndex].hooks_url);

    const dispatch = useDispatch();
    const hooksArray = useSelector(allHooks);
    const hooksArrayStatus = useSelector(allHooksStatus);
    const hooksArrayError = useSelector(allHooksError);

    if(hooksArrayStatus.toLowerCase() == 'idle'){
        dispatch(getHooksAsync(hooksURL));
    }

    const displayTimeString = string => {
        let str = string.slice(0, string.length - 1);
        return str.split('T')[0] + "\n at " + str.split('T')[1];
    }

    let hookRows = hooksArray.map(each => {
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
            [...hookRows], 
            [hookRows] 
    )

    const sortBy = [{ id: "type" }, { id: "createdAt" }];

    const renderDisplayElement = (componentStatus) => {

        switch(componentStatus){
          case 'loading':
          case 'idle':
            return <Loading />
          case 'successful':
            return <>
                  <h1>{organizationName} hooks: </h1>
                  <Table columns={columns} data={data} sortBy={sortBy} headerStyle="hooks"/>
                </>
          case 'failed':
            return hooksArrayError 
                  ? <Error msg= {hooksArrayError}/> 
                  : <Error msg="Sorry there was a problem :(  But we are on our way to fix it!"/>
        }
    }

    return (
        renderDisplayElement(hooksArrayStatus)
    )
}