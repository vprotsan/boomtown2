import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { currentMember, currentMemberStatus, currentMemberError, getMemberAsync } from './memberSlice';
import { useParams } from 'react-router-dom';
import styles from './Member.module.scss';
import { Loading } from '../loading/Loading';
import { Error } from  '../error/Error';


export function Member() {

    let organizationIndex = parseInt((useParams()).id);
    let organizationName = useSelector(store => store.organization.configs[organizationIndex].name);
    let memberId = useParams().member;
    const memberURL = [process.env.REACT_APP_API_USERS_URL, memberId].join('/');

    const dispatch = useDispatch();
    const member = useSelector(currentMember);
    const memberStatus = useSelector(currentMemberStatus);
    const memberError = useSelector(currentMemberError);

    if(member === null || (member.login).toLowerCase() !== memberId.toLowerCase()){
      dispatch(getMemberAsync(memberURL));
    }

    const renderDisplayElement = (componentStatus) => {

      switch(componentStatus){
        case 'loading':
        case 'idle':
          return <Loading />
        case 'successful':
          return <>
                  <div className={styles.member}>
                    <h1>{organizationName} Member: </h1>
                    <img src={member.avatar_url} alt={member.name}/>
                    <p>ID: {member.id}</p>
                    <p>Login: {member.login}</p>
                    <p>Type: {member.type}</p>
                    <p>Site Admin: {member.site_admin ? "Yes" : "No"}</p>
                    <p>Name: {member.name}</p>
                    <p>Company: {member.company}</p>
                    <p>Location: {member.location ? member.location : '---'}</p>
                    <p>BIO: {member.bio ? member.bio : "---"}</p>
                  </div>
                </>
        case 'failed':
          return memberError 
                ? <Error msg= {memberError}/> 
                : <Error msg="Sorry, there was a problem :(  But we are on our way to fix it!"/>
        default: 
          <Error msg="Sorry, we cannot find a page you are looking for."/>
      }
    }

    return (
      renderDisplayElement(memberStatus)
    )
}