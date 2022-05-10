import { configureStore } from '@reduxjs/toolkit';
import organizationReducer from '../features/organization/organizationSlice';
import repos from '../features/repositiories/repositoriesSlice';
import events from '../features/events/eventsSlice';
import hooks from '../features/hooks/hooksSlice';
import issues from '../features/issues/issuesSlice';
import members from '../features/members/membersSlice';
import member from '../features/member/memberSlice';

export const store = configureStore({
  reducer: {
    organization: organizationReducer,
    repositories: repos,
    events: events,
    hooks: hooks,
    issues: issues,
    members: members,
    member: member
  },
});
