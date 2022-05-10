import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { allMembers, allMembersStatus, allMembersError, getMembersAsync } from './membersSlice';
import { Link, useParams } from 'react-router-dom';
import { Table } from '../table/Table';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';
import styles from './Members.module.scss';


export function Members() {

    let organizationIndex = parseInt((useParams()).id);
    let organizationName = useSelector(store => store.organization.configs[organizationIndex].name);
    let membersURLfull = useSelector(store => store.organization.configs[organizationIndex].members_url);
    let membersURL = membersURLfull.split('{/member}')[0];

    const dispatch = useDispatch();
    const membersArray = useSelector(allMembers);
    const membersArrayStatus = useSelector(allMembersStatus);
    const membersArrayError = useSelector(allMembersError);

    if(membersArrayStatus.toLowerCase() === 'idle'){
        dispatch(getMembersAsync(membersURL));
    }

    let membersRows = membersArray.map(each => {
        return {
            "id": each.id,
            "login": each.login,
            "avatar": each.avatar_url,
            "htmlUrl": each.html_url,
            "type": each.type,
            "isSiteAdmin": each.site_admin ? "Yes" : "No"
        }
    })

    const columns = React.useMemo(
        () => [
          {
            Header: 'Id',
            accessor: row => row.id,
            Cell: cell => <span className={styles.id}>{cell.value}</span>
          },
          {
            Header: 'Login',
            accessor: row => row.login,
            Cell: (cell) => {
                let path = `/organizations/${organizationIndex}/members/${cell.row.original.login}`;
                return <Link to={path}>{cell.value}</Link>
            }
          },
          {
            Header: 'Avatar',
            accessor: row => row.avatar,
            Cell: (cell) => <img className={styles.avatar} src={cell.cell.value} alt={cell.row.original.name}/>
          },
          {
            Header: 'Type',
            accessor: 'type'
          },
          {
            Header: 'Is Admin',
            accessor: 'isSiteAdmin'
          }
        ],
        []
    )

    let data = React.useMemo(() =>
            [...membersRows], 
            [membersRows] 
    )

    const sortBy = [{ id: "id" }];

    const renderDisplayElement = (componentStatus) => {

      switch(componentStatus){
        case 'loading':
        case 'idle':
          return <Loading />
        case 'successful':
          return <>
                <h1>{organizationName} members: </h1>
                <Table columns={columns} data={data} sortBy={sortBy} headerStyle="members"/>
              </>
        case 'failed':
          return membersArrayError 
                ? <Error msg= {membersArrayError}/> 
                : <Error msg="Sorry there was a problem :(  But we are on our way to fix it!"/>
      }
    }

    return (
      renderDisplayElement(membersArrayStatus)
    )
}